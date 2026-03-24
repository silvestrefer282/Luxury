import os
import django
import sys

# Add the current backend directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.models import Usuario

print("--- Diagnóstico de Usuarios ---")
users = Usuario.objects.all()
if not users.exists():
    print("No hay usuarios registrados en la base de datos.")
else:
    for u in users:
        print(f"ID: {u.id}")
        print(f"Username: {u.username}")
        print(f"Email: {u.email}")
        print(f"Rol: {u.rol}")
        print(f"Is Active (Django): {u.is_active}")
        print(f"Estatus (Custom): {u.estatus}")
        print(f"Is Staff: {u.is_staff}")
        print(f"Is Superuser: {u.is_superuser}")
        print("-" * 30)
