"""
URL configuration for sorteo_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# sorteo_project/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from sorteo_app.views import (
    UploadCSVView,
    realizar_sorteo,
    ListadoSorteos,
    ListadoResultadosSorteo,
    ListadoRegistroActividad,
    listar_provincias, 
    listar_localidades
)
from sorteo_app.views.views_sorteo import PremioViewSet
from sorteo_app.views.download_templates import DownloadParticipantesTemplate, DownloadListaNegraTemplate
from sorteo_app.views.views_lists import ListLoadedData, ClearParticipantes, ClearListaNegra
from sorteo_app.views.blacklist import AddToBlacklist

router = routers.DefaultRouter()
router.register(r'premios', PremioViewSet, basename='premio')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/upload_csv/', UploadCSVView.as_view(), name='upload_csv'),
    path('api/lists/', ListLoadedData.as_view(), name='list_loaded_data'),
    path('api/lists/clear/participantes/', ClearParticipantes.as_view(), name='clear_participantes'),
    path('api/lists/clear/blacklist/', ClearListaNegra.as_view(), name='clear_blacklist'),
    path('api/blacklist/add/', AddToBlacklist.as_view(), name='add_to_blacklist'),
    path('api/download_template/participantes/', DownloadParticipantesTemplate.as_view(), name='download_template_participantes'),
    path('api/download_template/lista_negra/', DownloadListaNegraTemplate.as_view(), name='download_template_lista_negra'),    path('api/sortear/', realizar_sorteo, name='realizar_sorteo'),
    path('api/sorteos/', ListadoSorteos.as_view(), name='listado_sorteos'),
    path('api/resultados_sorteo/', ListadoResultadosSorteo.as_view(), name='listado_resultados_sorteo'),
    path('api/registro_actividad/', ListadoRegistroActividad.as_view(), name='listado_registro_actividad'),
    path('api/provincias/', listar_provincias, name='listar_provincias'),
    path('api/localidades/', listar_localidades, name='listar_localidades'),
    path('api/', include(router.urls)),
    path("", include("sorteo_app.urls")),  # Include the URL patterns from the sorteo_app app
]
