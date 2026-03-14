import os
import django
from datetime import date, time, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.models import *

# Crear un cliente si no hay
cliente = Cliente.objects.first()
if not cliente:
    user = Usuario.objects.filter(rol='Cliente').first()
    if not user:
        user = Usuario.objects.create_user(username='demo_cliente', email='demo@cliente.com', password='123', rol='Cliente', first_name='Demo')
    cliente, _ = Cliente.objects.get_or_create(usuario=user)

# Paquete
paquete = Paquete.objects.first()
if not paquete:
    paquete = Paquete.objects.create(nombre='Paquete Demo', descripcion='Demo', precio_base=10000, capacidad_personas=100, duracion_horas=5, precio_hora_adicional=1000)

for i, (est, apro, text, stars) in enumerate([
    ('Finalizada', True, 'Excelente servicio y atención en todos los detalles del evento.', 5),
    ('Finalizada', False, 'Buen lugar, aunque tuvimos un pequeño retraso para empezar, pero el trato fue muy amable.', 4),
    ('Finalizada', True, 'Superó todas nuestras expectativas. Recomendado.', 5)
]):
    reserva = Reservacion.objects.create(
        cliente=cliente,
        paquete=paquete,
        fecha_evento=date(2025, 12, 1) + timedelta(days=i),
        hora_inicio=time(14, 0),
        hora_fin=time(19, 0),
        num_personas=100,
        estado=est,
        total_estimado=10000
    )
    Testimonio.objects.create(
        reservacion=reserva,
        calificacion=stars,
        comentario=text,
        aprobado=apro
    )

print('Testimonios creados')
