# sorteo_app/views/scheduled_sorteos.py
from rest_framework import generics
from ..models import Sorteo
from ..serializers import SorteoSerializer

class ScheduledSorteosList(generics.ListCreateAPIView):
    """
    Lista todos los sorteos agendados y permite crear uno nuevo.
    Se asume que tienen fecha_programada definida.
    """
    queryset = Sorteo.objects.filter(fecha_programada__isnull=False)
    serializer_class = SorteoSerializer

class ScheduledSorteoDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Permite obtener, actualizar o eliminar un sorteo programado.
    """
    queryset = Sorteo.objects.filter(fecha_programada__isnull=False)
    serializer_class = SorteoSerializer
