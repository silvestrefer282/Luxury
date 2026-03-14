import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from rest_framework.test import APIClient
from sirlux.models import Usuario

user = Usuario.objects.get(username='parra.anita06@gmail.com')
client = APIClient()
from rest_framework.authtoken.models import Token
token, _ = Token.objects.get_or_create(user=user)
client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

response = client.get('/api/testimonios/')
print([t['reservacion'] for t in response.json()])
