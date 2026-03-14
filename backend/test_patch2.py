import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.test import Client
from sirlux.models import Usuario, Testimonio

user = Usuario.objects.get(username='admin')
from rest_framework.authtoken.models import Token
token, _ = Token.objects.get_or_create(user=user)

client = Client()
t = Testimonio.objects.first()

print(f"Testing PATCH on Testimonio ID {t.id}")
response = client.patch(
    f'/api/testimonios/{t.id}/', 
    {'aprobado': True}, 
    content_type='application/json',
    HTTP_AUTHORIZATION=f'Token {token.key}',
    HTTP_HOST='127.0.0.1'
)
print("Status Code:", response.status_code)
import re
if response.status_code >= 400:
    content = response.content.decode('utf-8', errors='ignore')
    match = re.search(r'<title>([^<]+)</title>', content)
    print("Error Title:", match.group(1) if match else "No title")
    val_match = re.search(r'Exception Value:.*?<pre[^>]*>(.*?)</pre>', content, re.DOTALL)
    print("Exception Value:", val_match.group(1).strip() if val_match else "No exception value found in HTML")
else:
    print("Response:", response.json())
