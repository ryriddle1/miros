from products.models import Product

def get_component_type(product):
    """Возвращает тип компонента из features"""
    features = product.features
    return features.get('Тип', '').lower() if features else ''

def check_compatibility(component_ids):
    """
    Проверяет совместимость набора компонентов.
    Возвращает: (compatible, issues)
    """
    products = Product.objects.filter(id__in=component_ids)
    issues = []
    compatible = True

    # Собираем компоненты по типам
    components_by_type = {}
    for p in products:
        p_type = get_component_type(p)
        if p_type:
            components_by_type.setdefault(p_type, []).append(p)

    # 1. Проверка совместимости процессора и материнской платы (сокет)
    cpu_list = components_by_type.get('процессор', [])
    mb_list = components_by_type.get('материнская плата', [])
    if cpu_list and mb_list:
        for cpu in cpu_list:
            cpu_socket = cpu.features.get('Сокет', '').lower()
            for mb in mb_list:
                mb_socket = mb.features.get('Сокет', '').lower()
                if cpu_socket and mb_socket and cpu_socket != mb_socket:
                    compatible = False
                    issues.append(f"Процессор {cpu.name} (сокет {cpu_socket}) не совместим с материнской платой {mb.name} (сокет {mb_socket})")
    # 2. Проверка типа оперативной памяти (DDR)
    ram_list = components_by_type.get('оперативная память', [])
    if ram_list and mb_list:
        # Берём первую материнскую плату для проверки
        mb = mb_list[0]
        mb_ram_type = mb.features.get('Тип памяти', '').lower()
        for ram in ram_list:
            ram_type = ram.features.get('Тип памяти', '').lower()
            if mb_ram_type and ram_type and mb_ram_type != ram_type:
                compatible = False
                issues.append(f"Материнская плата {mb.name} поддерживает {mb_ram_type}, а память {ram.name} имеет тип {ram_type}")
    # 3. Проверка мощности блока питания (если есть видеокарта)
    gpu_list = components_by_type.get('видеокарта', [])
    psu_list = components_by_type.get('блок питания', [])
    if gpu_list and psu_list:
        # Для простоты: видеокарта потребляет, блок питания даёт
        for gpu in gpu_list:
            gpu_power = gpu.features.get('Потребляемая мощность', 0)
            if isinstance(gpu_power, str):
                gpu_power = int(''.join(filter(str.isdigit, gpu_power)) or 0)
            for psu in psu_list:
                psu_power = psu.features.get('Мощность', 0)
                if isinstance(psu_power, str):
                    psu_power = int(''.join(filter(str.isdigit, psu_power)) or 0)
                if gpu_power and psu_power and gpu_power > psu_power:
                    compatible = False
                    issues.append(f"Блок питания {psu.name} ({psu_power}W) может не обеспечить питание видеокарты {gpu.name} ({gpu_power}W)")

    return compatible, issues