import os
import django
import pprint
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from sirlux.models import Testimonio, Reservacion

print("All reservations:")
data = []
for r in Reservacion.objects.all():
    t = getattr(r, 'testimonio', None)
    data.append({"id": r.id, "testimonio_id": t.id if t else None})
pprint.pprint(data)
