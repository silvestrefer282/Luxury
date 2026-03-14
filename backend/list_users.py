import os
import django
import sys

# Setup Django environment
sys.path.append('c:/Users/parra/OneDrive/Desktop/SIRLUX/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.models import Usuario

print("Usuarios registrados:")
for u in Usuario.objects.all():
    print(f"Username: {u.username}, Email: {u.email}, Rol: {u.rol}, Active: {u.is_active}, Staff: {u.is_staff}, Hero: {u.is_superuser}")
