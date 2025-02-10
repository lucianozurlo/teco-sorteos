# sorteo_app/views/snapshot_list.py

from rest_framework.generics import ListAPIView
from sorteo_app.models import SorteoSnapshot
from sorteo_app.serializers import SorteoSnapshotSerializer

class SorteoSnapshotList(ListAPIView):
    queryset = SorteoSnapshot.objects.all().order_by('-fecha_realizado')
    serializer_class = SorteoSnapshotSerializer
