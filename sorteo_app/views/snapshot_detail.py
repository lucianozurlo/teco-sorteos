# sorteo_app/views/snapshot_detail.py

from rest_framework.generics import RetrieveAPIView
from sorteo_app.models import SorteoSnapshot
from sorteo_app.serializers import SorteoSnapshotSerializer

class SorteoSnapshotDetail(RetrieveAPIView):
    queryset = SorteoSnapshot.objects.all()
    serializer_class = SorteoSnapshotSerializer
