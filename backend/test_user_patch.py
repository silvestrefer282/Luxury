import os
import django
import sys

# Set up Django environment
sys.path.append(r'c:\Users\TECHNOLOGYLAND\OneDrive\Escritorio\LUXURY4\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.serializers import UsuarioSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# Create a dummy user if none exists for testing
user = User.objects.filter(username='test_user_role').first()
if not user:
    user = User.objects.create_user(username='test_user_role', password='password123', email='test@example.com')

print(f"Testing partial update for user: {user.username} (ID: {user.id})")

# Simulate a PATCH request with only the 'rol' field
data = {'rol': 'Encargado'}
serializer = UsuarioSerializer(user, data=data, partial=True)

if serializer.is_valid():
    serializer.save()
    print("SUCCESS: Partial update (PATCH) valid without password.")
    print("New Role:", user.rol)
else:
    print("FAILURE: Partial update invalid.")
    print("Errors:", serializer.errors)

# Cleanup if needed (optional)
# user.delete()
