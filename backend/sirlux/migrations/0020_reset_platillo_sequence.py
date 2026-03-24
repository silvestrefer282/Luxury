from django.db import migrations, connection

def reset_sequence(apps, schema_editor):
    # Only run on PostgreSQL
    if connection.vendor == 'postgresql':
        with connection.cursor() as cursor:
            cursor.execute("SELECT setval(pg_get_serial_sequence('sirlux_platillo', 'id'), coalesce(max(id), 1), max(id) is not null) FROM sirlux_platillo;")

class Migration(migrations.Migration):
    dependencies = [
        ('sirlux', '0019_alter_servicioadicional_descripcion_and_more'),
    ]

    operations = [
        migrations.RunPython(reset_sequence),
    ]
