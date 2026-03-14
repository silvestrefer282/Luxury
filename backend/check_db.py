import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from sirlux.models import Testimonio, Reservacion

print("All reservations:")
for r in Reservacion.objects.all():
    t = getattr(r, 'testimonio', None)
    print(f"Reserva {r.id}: {r.estado} - PKT: {r.paquete.nombre} - User: {r.cliente.usuario.username} - Testimonio: {t.id if t else 'None'}")
