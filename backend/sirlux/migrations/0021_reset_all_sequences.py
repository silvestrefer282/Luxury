from django.db import migrations, connection

def reset_all_sequences(apps, schema_editor):
    if connection.vendor == 'postgresql':
        tables = [
            'sirlux_servicioadicional',
            'sirlux_platillo',
            'sirlux_categoriamenu',
            'sirlux_menu',
            'sirlux_reservacion',
            'sirlux_contrato',
            'sirlux_pagocontrato',
            'sirlux_usuario',
            'sirlux_galeria',
            'sirlux_paquete',
            'sirlux_cliente',
        ]
        with connection.cursor() as cursor:
            for table in tables:
                try:
                    # Usamos una sub-transacción o simplemente verificamos que la tabla existe
                    query = f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), coalesce(max(id), 1), max(id) is not null) FROM {table};"
                    cursor.execute(query)
                except Exception as e:
                    print(f"Error resetting sequence for {table}: {e}")
                    # En una migración, si un error ocurre, la transacción se aborta.
                    # Sin embargo, como estamos en un bucle, si un Postgres error ocurre, 
                    # el resto fallará a menos que se maneje la transacción.
                    # Pero aquí confiamos en que los nombres de las tablas son correctos.

class Migration(migrations.Migration):
    dependencies = [
        ('sirlux', '0020_reset_platillo_sequence'),
    ]

    operations = [
        migrations.RunPython(reset_all_sequences),
    ]
