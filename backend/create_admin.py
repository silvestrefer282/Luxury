import os
import django
import sys

# Setup Django environment
sys.path.append('c:/Users/parra/OneDrive/Desktop/SIRLUX/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.models import Usuario

# Creamos un admin que coincida con lo que el frontend envía (usa el email como username)
username = 'admin@luxury.com'
email = 'admin@luxury.com'
password = 'admin123'

if Usuario.objects.filter(username=username).exists():
    Usuario.objects.filter(username=username).delete()

user = Usuario.objects.create_superuser(
    username=username,
    email=email,
    password=password,
    rol='Administrador',
    first_name='Admin',
    apellido_paterno='Luxury'
)
print(f"Usuario admin creado exitosamente con username: {username}")

# También creamos uno con username 'admin' por si acaso
if not Usuario.objects.filter(username='admin').exists():
    Usuario.objects.create_superuser(
        username='admin',
        email='admin_alt@luxury.com',
        password=password,
        rol='Administrador',
        first_name='Admin',
        apellido_paterno='Luxury'
    )
    print("Usuario 'admin' (corto) creado exitosamente.")
