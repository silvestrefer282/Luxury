import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from rest_framework.test import APIClient
from sirlux.models import Usuario, Testimonio

user = Usuario.objects.get(username='admin')
from rest_framework.authtoken.models import Token
token, _ = Token.objects.get_or_create(user=user)

client = APIClient()
client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

t = Testimonio.objects.first()
if getattr(t, 'aprobado', False):
    print("Testimonio is already approved, unapproving it before testing patch")
    t.aprobado = False
    t.save()
print(f"Testing PATCH on Testimonio ID {t.id}")
response = client.patch(f'/api/testimonios/{t.id}/', {'aprobado': True}, format='json')
print("Status Code:", response.status_code)
print("Response:", response.content)
