import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from sirlux.serializers import TestimonioSerializer
from sirlux.models import Testimonio, Reservacion

print("Testing serialization for Reservation ID 2")
r = Reservacion.objects.get(id=2)
print("Reserva estado:", r.estado)

data = {
    'reservacion': r.id,
    'calificacion': 5,
    'comentario': 'estuvo perron'
}

s = TestimonioSerializer(data=data)
print("Is valid?", s.is_valid())
if not s.is_valid():
    print("Errors:", s.errors)
