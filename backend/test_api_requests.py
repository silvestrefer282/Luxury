import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

import urllib.request
import json
from sirlux.models import Usuario
from rest_framework.authtoken.models import Token

user = Usuario.objects.get(username='parra.anita06@gmail.com')
token, _ = Token.objects.get_or_create(user=user)

req = urllib.request.Request('http://127.0.0.1:8000/api/testimonios/', headers={'Authorization': 'Token ' + token.key})
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode())
    print("Status:", res.status)
    print("Testimonios ids fetched:", [d['id'] for d in data])
    print("Keys of first:", data[0].keys() if data else [])
