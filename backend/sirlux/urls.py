from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReservacionViewSet, PaqueteViewSet, MenuViewSet, 
    CategoriaMenuViewSet, PlatilloViewSet,
    ServicioAdicionalViewSet, ClienteViewSet, UsuarioViewSet,
    DegustacionViewSet, GaleriaViewSet, ContratoViewSet, PagoContratoViewSet,
    TestimonioViewSet
)

router = DefaultRouter()
router.register(r'reservaciones', ReservacionViewSet)
router.register(r'paquetes', PaqueteViewSet)
router.register(r'menus', MenuViewSet)
router.register(r'categorias-menu', CategoriaMenuViewSet)
router.register(r'platillos', PlatilloViewSet)
router.register(r'servicios', ServicioAdicionalViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'degustaciones', DegustacionViewSet)
router.register(r'galeria', GaleriaViewSet)
router.register(r'contratos', ContratoViewSet)
router.register(r'pagos-contrato', PagoContratoViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'testimonios', TestimonioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]