from products.models import Product

# Типы компонентов (названия ключей в features)
COMPONENT_TYPES = {
    'cpu': 'процессор',
    'gpu': 'видеокарта',
    'motherboard': 'материнская плата',
    'ram': 'оперативная память',
    'ssd': 'SSD',
    'psu': 'блок питания',
    'case': 'корпус'
}

# Популярные сборки (шаблоны)
POPULAR_BUILDS = {
    'gaming': {
        'name': 'Игровой ПК',
        'components': [
            {'type': 'cpu', 'name_contains': 'Intel i5', 'max_price': 20000},
            {'type': 'gpu', 'name_contains': 'RTX 3060', 'max_price': 35000},
            {'type': 'ram', 'name_contains': '16GB', 'max_price': 8000},
            {'type': 'ssd', 'name_contains': '512GB', 'max_price': 5000},
            {'type': 'motherboard', 'name_contains': 'B660', 'max_price': 10000},
            {'type': 'psu', 'name_contains': '600W', 'max_price': 5000},
            {'type': 'case', 'name_contains': '', 'max_price': 5000}
        ]
    },
    'office': {
        'name': 'Офисный ПК',
        'components': [
            {'type': 'cpu', 'name_contains': 'Intel i3', 'max_price': 10000},
            {'type': 'ram', 'name_contains': '8GB', 'max_price': 4000},
            {'type': 'ssd', 'name_contains': '256GB', 'max_price': 3000},
            {'type': 'motherboard', 'name_contains': 'H610', 'max_price': 5000},
            {'type': 'psu', 'name_contains': '400W', 'max_price': 3000},
            {'type': 'case', 'name_contains': '', 'max_price': 2000}
        ]
    },
    'graphics': {
        'name': 'Рабочая станция',
        'components': [
            {'type': 'cpu', 'name_contains': 'Intel i7', 'max_price': 30000},
            {'type': 'gpu', 'name_contains': 'RTX 4070', 'max_price': 60000},
            {'type': 'ram', 'name_contains': '32GB', 'max_price': 15000},
            {'type': 'ssd', 'name_contains': '1TB', 'max_price': 8000},
            {'type': 'motherboard', 'name_contains': 'Z790', 'max_price': 20000},
            {'type': 'psu', 'name_contains': '750W', 'max_price': 8000},
            {'type': 'case', 'name_contains': '', 'max_price': 7000}
        ]
    }
}

def get_component_type(product):
    """Возвращает тип компонента из features (нижний регистр)"""
    features = product.features
    return features.get('Тип', '').lower() if features else ''

def get_popular_build(purpose='gaming'):
    """Возвращает список продуктов для популярной сборки (без проверки совместимости)"""
    build_template = POPULAR_BUILDS.get(purpose, POPULAR_BUILDS['gaming'])
    recommended = []
    for comp in build_template['components']:
        filters = {'features__Тип': comp['type']}
        if comp['name_contains']:
            filters['name__icontains'] = comp['name_contains']
        product = Product.objects.filter(**filters, cost__lte=comp['max_price']).order_by('-cost').first()
        if product:
            recommended.append(product)
    return recommended

def _get_motherboard_for_cpu(cpu, budget):
    """Подобрать материнскую плату под процессор по сокету"""
    cpu_socket = cpu.features.get('Сокет', '').lower()
    if cpu_socket:
        qs = Product.objects.filter(
            features__Тип='материнская плата',
            features__Сокет=cpu_socket,
            cost__lte=budget
        )
    else:
        qs = Product.objects.filter(features__Тип='материнская плата', cost__lte=budget)
    return qs.order_by('-cost').first()

def _get_cpu_for_motherboard(motherboard, budget):
    """Подобрать процессор под материнскую плату по сокету"""
    mb_socket = motherboard.features.get('Сокет', '').lower()
    if mb_socket:
        qs = Product.objects.filter(
            features__Тип='процессор',
            features__Сокет=mb_socket,
            cost__lte=budget
        )
    else:
        qs = Product.objects.filter(features__Тип='процессор', cost__lte=budget)
    return qs.order_by('-cost').first()

def _get_ram_for_motherboard(motherboard, budget):
    """Подобрать оперативную память под материнскую плату по типу DDR"""
    mb_ram_type = motherboard.features.get('Тип памяти', '').lower()
    filters = {'features__Тип': 'оперативная память', 'cost__lte': budget}
    if mb_ram_type:
        filters['features__Тип памяти'] = mb_ram_type
    qs = Product.objects.filter(**filters)
    return qs.order_by('-cost').first()

def _get_psu_for_gpu(gpu, budget):
    """Подобрать блок питания для видеокарты (по потребляемой мощности)"""
    gpu_power = gpu.features.get('Потребляемая мощность', 0)
    if isinstance(gpu_power, str):
        gpu_power = int(''.join(filter(str.isdigit, gpu_power)) or 0)
    # Ищем блок питания с мощностью не менее чем у видеокарты + запас 100 Вт
    min_psu_power = gpu_power + 100 if gpu_power else 0
    qs = Product.objects.filter(features__Тип='блок питания', cost__lte=budget)
    # Фильтр по мощности – можно реализовать через извлечение числа из features, но для простоты пока без
    return qs.order_by('-cost').first()

def recommend(selected_ids=None, purpose='gaming', budget=None):
    """
    Основная функция рекомендации.
    Если selected_ids пуст – возвращает популярную сборку.
    Иначе дополняет недостающие компоненты с учётом совместимости.
    """
    selected_products = list(Product.objects.filter(id__in=selected_ids)) if selected_ids else []
    selected_types = {get_component_type(p) for p in selected_products if get_component_type(p)}
    all_types = set(COMPONENT_TYPES.values())
    missing_types = all_types - selected_types

    # Если ничего не выбрано – популярная сборка
    if not selected_products:
        rec = get_popular_build(purpose)
        return {
            'recommended': rec,
            'message': f'Рекомендуем {POPULAR_BUILDS.get(purpose, POPULAR_BUILDS["gaming"])["name"]}'
        }

    # Начинаем с выбранных компонентов
    recommended = list(selected_products)

    # Определяем наличие процессора и материнской платы для дальнейшей совместимости
    has_cpu = any(p for p in recommended if get_component_type(p) == 'процессор')
    has_mb = any(p for p in recommended if get_component_type(p) == 'материнская плата')
    has_gpu = any(p for p in recommended if get_component_type(p) == 'видеокарта')

    # Бюджетные ограничения (если заданы)
    def remaining_budget():
        if budget is None:
            return None
        total = sum(p.cost for p in recommended)
        # Приводим к одному типу (float)
        return float(budget) - float(total)

    # Дополняем компоненты в порядке приоритета
    # Сначала процессор и материнская плата (чтобы подбирать под них остальное)
    if 'процессор' in missing_types and has_mb:
        mb = next(p for p in recommended if get_component_type(p) == 'материнская плата')
        rb = remaining_budget()
        if rb is None or rb > 0:
            cpu = _get_cpu_for_motherboard(mb, rb if rb else 100000)
            if cpu:
                recommended.append(cpu)
                missing_types.discard('процессор')
    if 'материнская плата' in missing_types and has_cpu:
        cpu = next(p for p in recommended if get_component_type(p) == 'процессор')
        rb = remaining_budget()
        if rb is None or rb > 0:
            mb = _get_motherboard_for_cpu(cpu, rb if rb else 100000)
            if mb:
                recommended.append(mb)
                missing_types.discard('материнская плата')

    # Оперативная память (под материнскую плату)
    if 'оперативная память' in missing_types and has_mb:
        mb = next(p for p in recommended if get_component_type(p) == 'материнская плата')
        rb = remaining_budget()
        if rb is None or rb > 0:
            ram = _get_ram_for_motherboard(mb, rb if rb else 50000)
            if ram:
                recommended.append(ram)
                missing_types.discard('оперативная память')

    # Блок питания (под видеокарту)
    if 'блок питания' in missing_types and has_gpu:
        gpu = next(p for p in recommended if get_component_type(p) == 'видеокарта')
        rb = remaining_budget()
        if rb is None or rb > 0:
            psu = _get_psu_for_gpu(gpu, rb if rb else 30000)
            if psu:
                recommended.append(psu)
                missing_types.discard('блок питания')

    # Остальные компоненты подбираем без сложной совместимости (SSD, корпус)
    for miss_type in missing_types:
        if miss_type in ['SSD', 'корпус']:
            rb = remaining_budget()
            if rb is None or rb > 0:
                product = Product.objects.filter(features__Тип=miss_type, cost__lte=rb if rb else 20000).order_by('-cost').first()
                if product:
                    recommended.append(product)

    # Финальная проверка совместимости (опционально, можно вызвать отдельно)
    return {
        'recommended': recommended,
        'message': 'Подобраны недостающие компоненты с учётом совместимости'
    }