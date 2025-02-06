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
    Elimina todos los registros de la Lista Negra y reintegra a los participantes.
    Es decir, los participantes excluidos se vuelven a agregar a la base de participantes.
    """
    def delete(self, request):
        try:
            with transaction.atomic():
                # Obtener todos los registros de la lista negra
                blacklist_items = ListaNegra.objects.all()
                reinserted = 0
                for item in blacklist_items:
                    # Solo reinsertar si no existe ya en Participante
                    if not Participante.objects.filter(id=item.id).exists():
                        Participante.objects.create(
                            id=item.id,
                            nombre=item.nombre if item.nombre != '-' else '',
                            apellido=item.apellido if item.apellido != '-' else '',
                            email=item.email if item.email != '-' else '',
                            area=item.area if item.area != '-' else '',
                            dominio=item.dominio if item.dominio != '-' else '',
                            cargo=item.cargo if item.cargo != '-' else '',
                            localidad=item.localidad if item.localidad != '-' else '',
                            provincia=item.provincia if item.provincia != '-' else '',
                        )
                        reinserted += 1
                # Luego, borrar la lista negra
                deleted, _ = ListaNegra.objects.all().delete()
        except Exception as e:
            return Response({
                'error': f'Error al vaciar y reintegrar la lista de no incluidos: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'message': f'Lista de no incluidos vaciada. Se reintegraron {reinserted} participantes.',
            'deleted': deleted
        }, status=status.HTTP_200_OK)