from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReservacionViewSet, PaqueteViewSet, MenuViewSet, 
    CategoriaMenuViewSet, PlatilloViewSet,
    ServicioAdicionalViewSet, ClienteViewSet,
    DegustacionViewSet, GaleriaViewSet
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

urlpatterns = [
    path('', include(router.urls)),
]