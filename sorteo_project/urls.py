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
from sorteo_app.views.add_participant import AddToParticipants
from sorteo_app.views.reports import ReportesView, EstadisticasView
from sorteo_app.views.scheduled_sorteos import ScheduledSorteosList, ScheduledSorteoDetail
from sorteo_app.views.snapshot_detail import SorteoSnapshotDetail
from sorteo_app.views.snapshot_list import SorteoSnapshotList

router = routers.DefaultRouter()
router.register(r'premios', PremioViewSet, basename='premio')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/upload_csv/', UploadCSVView.as_view(), name='upload_csv'),
    path('api/lists/', ListLoadedData.as_view(), name='list_loaded_data'),
    path('api/lists/clear/participantes/', ClearParticipantes.as_view(), name='clear_participantes'),
    path('api/lists/clear/blacklist/', ClearListaNegra.as_view(), name='clear_blacklist'),
    path('api/blacklist/add/', AddToBlacklist.as_view(), name='add_to_blacklist'),
    path('api/participants/add/', AddToParticipants.as_view(), name='add_to_participants'),
    path('api/download_template/participantes/', DownloadParticipantesTemplate.as_view(), name='download_template_participantes'),
    path('api/download_template/lista_negra/', DownloadListaNegraTemplate.as_view(), name='download_template_lista_negra'),
    path('api/sortear/', realizar_sorteo, name='realizar_sorteo'),
    path('api/sorteos/', ListadoSorteos.as_view(), name='listado_sorteos'),
    path('api/resultados_sorteo/', ListadoResultadosSorteo.as_view(), name='listado_resultados_sorteo'),
    path('api/registro_actividad/', ListadoRegistroActividad.as_view(), name='listado_registro_actividad'),
    path('api/provincias/', listar_provincias, name='listar_provincias'),
    path('api/localidades/', listar_localidades, name='listar_localidades'),
    path('api/snapshot/<int:pk>/', SorteoSnapshotDetail.as_view(), name='snapshot_detail'),
    path('api/sorteos/snapshots/', SorteoSnapshotList.as_view(), name='snapshot_list'),
    path('api/reports/', ReportesView.as_view(), name='reports'),
    path('api/estadisticas/', EstadisticasView.as_view(), name='estadisticas'),
    path('api/scheduled/', ScheduledSorteosList.as_view(), name='scheduled_sorteos_list'),
    path('api/scheduled/<int:pk>/', ScheduledSorteoDetail.as_view(), name='scheduled_sorteo_detail'),
    path('api/', include(router.urls)),
]
