import os
import django
import json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from sirlux.models import Testimonio
data = [{"id": t.id, "reservacion_id": t.reservacion_id} for t in Testimonio.objects.all()]
print("TESTIMONIOS:")
print(json.dumps(data, indent=2))
