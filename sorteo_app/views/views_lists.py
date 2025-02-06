# sorteo_app/views/views_lists.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Participante, ListaNegra

class ListLoadedData(APIView):
    """
    Devuelve el contenido actual:
      - Participantes: todos los registros de Participante.
      - Blacklist: todos los registros de ListaNegra.
    """
    def get(self, request):
        try:
            participantes = list(Participante.objects.all().values())
            blacklist = list(ListaNegra.objects.all().values())
        except Exception as e:
            return Response({"error": "Error al obtener los datos."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'participantes': participantes, 'blacklist': blacklist}, status=status.HTTP_200_OK)

class ClearParticipantes(APIView):
    """
    Elimina todos los registros de Participante.
    """
    def delete(self, request):
        try:
            deleted, _ = Participante.objects.all().delete()
        except Exception as e:
            return Response({"error": "Error al eliminar participantes."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "Participantes eliminados", "deleted": deleted}, status=status.HTTP_200_OK)

class ClearListaNegra(APIView):
    """
    Elimina todos los registros de la Lista Negra.
    """
    def delete(self, request):
        try:
            deleted, _ = ListaNegra.objects.all().delete()
        except Exception as e:
            return Response({"error": "Error al eliminar la lista negra."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "Lista eliminada", "deleted": deleted}, status=status.HTTP_200_OK)
