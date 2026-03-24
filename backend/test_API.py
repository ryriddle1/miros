import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

# Тестовые данные
USERNAME = "testuser_api"
PASSWORD = "TestPass123"
EMAIL = "test_api@example.com"
PHONE = "+79991112233"
FIRST_NAME = "Тест"
LAST_NAME = "Тестов"

PRODUCT_ID = 1   # замени на существующий ID товара в твоей базе

def log_response(name, response):
    print(f"\n=== {name} ===")
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
    except:
        print(f"Response: {response.text}")
    return response

# 1. Регистрация
print("Регистрация пользователя...")
reg_data = {
    "username": USERNAME,
    "password": PASSWORD,
    "email": EMAIL,
    "phone_number": PHONE,
    "first_name": FIRST_NAME,
    "last_name": LAST_NAME
}
resp = requests.post(f"{BASE_URL}/auth/register/", json=reg_data)
log_response("Регистрация", resp)
if resp.status_code != 201:
    print("Ошибка регистрации, возможно пользователь уже существует. Продолжаем с логином...")

# 2. Логин
print("\nЛогин...")
login_data = {"username": USERNAME, "password": PASSWORD}
resp = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
log_response("Логин", resp)
if resp.status_code != 200:
    print("Ошибка логина, тест прерван.")
    sys.exit(1)
tokens = resp.json()
access_token = tokens["access"]

headers = {"Authorization": f"Bearer {access_token}"}

# 3. Профиль
resp = requests.get(f"{BASE_URL}/auth/me/", headers=headers)
log_response("Профиль пользователя", resp)

# 4. Список товаров
resp = requests.get(f"{BASE_URL}/products/")
log_response("Список товаров", resp)
if resp.status_code == 200:
    products = resp.json()
    if products:
        PRODUCT_ID = products[0]["id"]
        print(f"Будем использовать товар с ID {PRODUCT_ID}")

# 5. Детали товара
if PRODUCT_ID:
    resp = requests.get(f"{BASE_URL}/products/{PRODUCT_ID}/")
    log_response("Детали товара", resp)

# 6. Корзина (просмотр)
resp = requests.get(f"{BASE_URL}/cart/", headers=headers)
log_response("Корзина (начальная)", resp)

# 7. Добавление товара в корзину
if PRODUCT_ID:
    add_data = {"product_id": PRODUCT_ID, "quantity": 2}
    resp = requests.post(f"{BASE_URL}/cart/items/", json=add_data, headers=headers)
    log_response("Добавление товара в корзину", resp)
    cart_item_id = None
    if resp.status_code == 201:
        cart_item_id = resp.json().get("id")

# 8. Просмотр корзины после добавления
resp = requests.get(f"{BASE_URL}/cart/", headers=headers)
log_response("Корзина после добавления", resp)

# 9. Изменение количества товара в корзине
if cart_item_id:
    update_data = {"quantity": 5}
    resp = requests.put(f"{BASE_URL}/cart/items/{cart_item_id}/", json=update_data, headers=headers)
    log_response("Изменение количества", resp)

# 10. Удаление товара из корзины (не будем удалять, если хотим создать заказ)
#    закомментируем, чтобы не удалять перед заказом
# if cart_item_id:
#     resp = requests.delete(f"{BASE_URL}/cart/items/{cart_item_id}/", headers=headers)
#     log_response("Удаление товара из корзины", resp)

# 11. Создание заказа
order_data = {
    "delivery_address": "ул. Тестовая, д. 1",
    "payment_method": "card",
    "comment": "Тестовый заказ"
}
resp = requests.post(f"{BASE_URL}/cart/orders/", json=order_data, headers=headers)
log_response("Создание заказа", resp)
order_id = None
if resp.status_code == 201:
    order_id = resp.json().get("id")

# 12. Список заказов
resp = requests.get(f"{BASE_URL}/cart/orders/", headers=headers)
log_response("Список заказов", resp)

# 13. Детали заказа
if order_id:
    resp = requests.get(f"{BASE_URL}/cart/orders/{order_id}/", headers=headers)
    log_response("Детали заказа", resp)

# 14. Сервисная заявка
service_data = {
    "device_type": "Ноутбук",
    "problem_description": "Не включается",
    "preferred_date": "2025-04-01"
}
resp = requests.post(f"{BASE_URL}/service-requests/", json=service_data, headers=headers)
log_response("Создание заявки на ремонт", resp)

# 15. Вызов мастера
call_data = {
    "address": "ул. Тестовая, д. 10",
    "phone": PHONE,
    "preferred_time": "10:00-12:00",
    "description": "Не работает системный блок"
}
resp = requests.post(f"{BASE_URL}/call-master/", json=call_data, headers=headers)
log_response("Вызов мастера", resp)

# 16. Список компонентов конструктора
resp = requests.get(f"{BASE_URL}/builder/components/")
log_response("Список компонентов", resp)

# 17. Проверка совместимости (используем компоненты из списка, если есть)
if PRODUCT_ID:
    comp_data = {"components": [PRODUCT_ID]}
    resp = requests.post(f"{BASE_URL}/builder/check-compatibility/", json=comp_data, headers=headers)
    log_response("Проверка совместимости", resp)

# 18. Создание сборки
build_data = {
    "name": "Тестовая сборка",
    "component_ids": [PRODUCT_ID] if PRODUCT_ID else []
}
resp = requests.post(f"{BASE_URL}/builder/builds/", json=build_data, headers=headers)
log_response("Создание сборки", resp)
build_id = None
if resp.status_code == 201:
    build_id = resp.json().get("id")

# 19. Список сборок
resp = requests.get(f"{BASE_URL}/builder/builds/", headers=headers)
log_response("Список сборок", resp)

# 20. Добавление сборки в корзину
if build_id:
    resp = requests.post(f"{BASE_URL}/builder/builds/{build_id}/add-to-cart/", headers=headers)
    log_response("Добавление сборки в корзину", resp)

print("\n=== Тестирование завершено ===")

# 21. Рекомендация без выбранных компонентов (популярная сборка)
print("\n=== Рекомендация (популярная игровая) ===")
resp = requests.post(f"{BASE_URL}/builder/recommend/", json={"purpose": "gaming"})
log_response("Рекомендация (популярная)", resp)

# 22. Рекомендация с выбранными компонентами
print("\n=== Рекомендация (дополнение сборки) ===")
# используем тот же PRODUCT_ID, который уже есть
resp = requests.post(f"{BASE_URL}/builder/recommend/", json={"selected_ids": [PRODUCT_ID], "purpose": "gaming", "budget": 150000})
log_response("Рекомендация (дополнение)", resp)

# 23. Проверка совместимости (уже есть, но можно повторить с новыми данными)
print("\n=== Проверка совместимости (с выбранными компонентами из рекомендации) ===")
if resp.status_code == 200:
    rec_ids = [comp['id'] for comp in resp.json().get('recommended_components', [])]
    if rec_ids:
        comp_resp = requests.post(f"{BASE_URL}/builder/check-compatibility/", json={"components": rec_ids}, headers=headers)
        log_response("Проверка совместимости (рекомендованной сборки)", comp_resp)