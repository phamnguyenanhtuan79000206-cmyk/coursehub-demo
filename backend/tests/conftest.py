import os

# database.py kiem tra bien moi truong ngay khi import. create_engine() khong mo ket noi,
# nen test contract chi can gia tri gia (khong bao gio dung de ket noi DB that).
for _name, _value in {
    "DB_HOST": "127.0.0.1",
    "DB_PORT": "5432",
    "DB_NAME": "coursehub_test",
    "DB_USER": "test",
    "DB_PASSWORD": "test",
}.items():
    os.environ.setdefault(_name, _value)
