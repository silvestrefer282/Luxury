from django.contrib import admin
from .models import (
    Usuario, Cliente, Paquete, ImagenPaquete, Menu, CategoriaMenu, Platillo, ServicioAdicional, 
    Reservacion, Degustacion, ConfiguracionSistema, Galeria, Contrato, PagoContrato,
    Testimonio
)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'rol', 'is_staff')

admin.site.register(Cliente)
admin.site.register(Paquete)
admin.site.register(ImagenPaquete)
admin.site.register(Menu)
admin.site.register(CategoriaMenu)
admin.site.register(Platillo)
admin.site.register(ServicioAdicional)
admin.site.register(Reservacion)
admin.site.register(Degustacion)
admin.site.register(ConfiguracionSistema)
admin.site.register(Galeria)
admin.site.register(Contrato)
admin.site.register(PagoContrato)

@admin.register(Testimonio)
class TestimonioAdmin(admin.ModelAdmin):
    list_display = ('reservacion', 'calificacion', 'aprobado', 'fecha_creacion')
    list_filter = ('aprobado', 'calificacion')
    actions = ['aprobar_testimonios']

    def aprobar_testimonios(self, request, queryset):
        queryset.update(aprobado=True)
    aprobar_testimonios.short_description = "Aprobar testimonios seleccionados"
