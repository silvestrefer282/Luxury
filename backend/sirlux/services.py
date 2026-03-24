from datetime import datetime, timedelta
from decimal import Decimal
from django.db.models import Q
from .models import Reservacion, ConfiguracionSistema

def calcular_costo_reservacion(reservacion_data, servicios_ids=None):
    """
    Lógica de negocio para calcular el total estimado de una reservación.
    """
    config = ConfiguracionSistema.get_solo()
    paquete = reservacion_data['paquete']
    menu = reservacion_data.get('menu')
    num_personas = reservacion_data.get('num_personas', 0)
    hora_inicio = reservacion_data['hora_inicio']
    hora_fin = reservacion_data['hora_fin']
    
    # 1. Precio Base del Paquete
    total = paquete.precio_base
    
    # 2. Tiempos extra de menú
    # Si el paquete incluye N tiempos y el menú seleccionado tiene más, se cobra la diferencia
    if menu and paquete.incluye_menu:
        tiempos_extra = max(0, menu.tipo_tiempos - paquete.numero_tiempos)
        if tiempos_extra > 0:
            # Asumimos que el precio_por_persona del menú ya contempla los tiempos, 
            # o podrías tener una regla específica. Aquí sumamos el precio del menú por persona.
            total += (menu.precio_por_persona * Decimal(num_personas))

    # 3. Servicios Adicionales
    if servicios_ids:
        from .models import ServicioAdicional
        servicios = ServicioAdicional.objects.filter(id__in=servicios_ids)
        for s in servicios:
            if s.tipo_cobro == "Por Evento":
                total += s.precio_unitario
            else: # Por Persona
                total += (s.precio_unitario * Decimal(num_personas))

    # 4. Horas Extra
    # Calculamos la duración
    dt_inicio = datetime.combine(datetime.today(), hora_inicio)
    dt_fin = datetime.combine(datetime.today(), hora_fin)
    if dt_fin <= dt_inicio: # Si termina el día siguiente
        dt_fin += timedelta(days=1)
    
    duracion_actual = (dt_fin - dt_inicio).total_seconds() / 3600
    horas_extra = max(0, Decimal(duracion_actual) - Decimal(paquete.duracion_horas))
    if horas_extra > 0:
        total += (horas_extra * config.precio_hora_extra)
        
    return total

def verificar_disponibilidad(fecha, hora_inicio, hora_fin, reserva_id_ignore=None):
    """
    Verifica si hay traslape considerando el tiempo de limpieza.
    Usa objetos datetime para evitar errores con medianoche.
    """
    config = ConfiguracionSistema.get_solo()
    limpieza = timedelta(hours=float(config.hora_limpieza) if config.hora_limpieza else 0)
    
    # Construir datetimes para la nueva reserva
    dt_inicio_nueva = datetime.combine(fecha, hora_inicio)
    dt_fin_nueva = datetime.combine(fecha, hora_fin)
    if dt_fin_nueva <= dt_inicio_nueva:
        dt_fin_nueva += timedelta(days=1)

    # Buscar reservas que puedan traslapar (hoy, ayer, mañana para cubrir eventos cruzando medianoche)
    reservas_rango = Reservacion.objects.filter(
        fecha_evento__range=[fecha - timedelta(days=1), fecha + timedelta(days=1)]
    ).exclude(estado='Cancelada')
    
    if reserva_id_ignore:
        reservas_rango = reservas_rango.exclude(id=reserva_id_ignore)

    for r in reservas_rango:
        dt_inicio_existente = datetime.combine(r.fecha_evento, r.hora_inicio)
        dt_fin_existente = datetime.combine(r.fecha_evento, r.hora_fin)
        if dt_fin_existente <= dt_inicio_existente:
            dt_fin_existente += timedelta(days=1)
        
        # Bloque bloqueado: desde (inicio - limpieza) hasta (fin + limpieza)
        bloque_inicio = dt_inicio_existente - limpieza
        bloque_fin = dt_fin_existente + limpieza
        
        # Hay traslape si los rangos se superponen
        if dt_inicio_nueva < bloque_fin and dt_fin_nueva > bloque_inicio:
            return False, f"Conflicto con evento existente de {r.hora_inicio.strftime('%H:%M')} a {r.hora_fin.strftime('%H:%M')} (incluye limpieza)."

    return True, "Disponible"
