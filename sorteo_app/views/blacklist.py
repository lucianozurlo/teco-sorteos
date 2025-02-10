# sorteo_app/views/blacklist.py
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import ListaNegra, Participante

logger = logging.getLogger(__name__)

class AddToBlacklist(APIView):
    """
    Permite agregar individualmente un participante a la lista negra.
    Se espera recibir un JSON con el campo "id". Si el participante existe en la base de participantes,
    se toman sus datos para la lista negra; de lo contrario, se usan valores por defecto.
    Además, se elimina el registro de Participante para evitar duplicidad.
    """
    def post(self, request, format=None):
        participant_id = request.data.get('id')
        if not participant_id:
            logger.warning("Falta el legajo del participante en blacklist")
            return Response({"error": "Falta el legajo del participante."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            participant_id = int(participant_id)
        except ValueError:
            logger.warning("El id debe ser numérico en blacklist: %s", participant_id)
            return Response({"error": "El id debe ser un número."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            participante = Participante.objects.get(id=participant_id)
            defaults_data = {
                'nombre': participante.nombre,
                'apellido': participante.apellido,
                'area': participante.area if participante.area else '-',
                'dominio': participante.dominio if participante.dominio else '-',
                'cargo': participante.cargo if participante.cargo else '-',
                'email': participante.email,
                'localidad': participante.localidad,
                'provincia': participante.provincia,
            }
        except Participante.DoesNotExist:
            defaults_data = {
                'nombre': '-',
                'apellido': '-',
                'area': '-',
                'dominio': '-',
                'cargo': '-',
                'email': '-',
                'localidad': '-',
                'provincia': '-',
            }
        
        try:
            obj, created = ListaNegra.objects.update_or_create(
                id=participant_id,
                defaults=defaults_data
            )
            if Participante.objects.filter(id=participant_id).exists():
                Participante.objects.filter(id=participant_id).delete()
        except Exception as e:
            logger.error("Error en blacklist: %s", e)
            return Response({"error": "Error interno al agregar a la lista negra."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        message = "Participante agregado a la lista de no incluidos." if created else "El participante ya se encontraba en la lista."
        return Response({"message": message}, status=status.HTTP_200_OK)
