# sorteo_app/views/add_participant.py
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Participante, ListaNegra

logger = logging.getLogger(__name__)

class AddToParticipants(APIView):
    """
    Permite agregar manualmente un registro a la lista de participantes.
    Se esperan recibir los siguientes campos en JSON:
      - id (legajo) *
      - nombre *
      - apellido *
      - email *
      - area (opcional)
      - dominio (opcional)
      - cargo (opcional)
      - localidad (opcional)
      - provincia (opcional)
    (*) Campos requeridos.
    Además, si el legajo ya se encuentra en la lista negra, se elimina para no duplicar.
    """
    def post(self, request, format=None):
        data = request.data
        required_fields = ['id', 'nombre', 'apellido', 'email']
        missing = [field for field in required_fields if field not in data or not str(data[field]).strip()]
        if missing:
            logger.warning("Faltan campos requeridos: %s", missing)
            return Response(
                {"error": f"Faltan campos requeridos: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            legajo = int(data['id'])
        except ValueError:
            logger.warning("El legajo debe ser numérico: %s", data.get('id'))
            return Response(
                {"error": "El legajo (id) debe ser un número."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            participante, created = Participante.objects.update_or_create(
                id=legajo,
                defaults={
                    'nombre': data['nombre'],
                    'apellido': data['apellido'],
                    'email': data['email'],
                    'area': data.get('area', ''),
                    'dominio': data.get('dominio', ''),
                    'cargo': data.get('cargo', ''),
                    'localidad': data.get('localidad', ''),
                    'provincia': data.get('provincia', ''),
                }
            )
            if ListaNegra.objects.filter(id=legajo).exists():
                ListaNegra.objects.filter(id=legajo).delete()
        except Exception as e:
            logger.error("Error al crear/actualizar participante: %s", e)
            return Response({"error": "Error interno al procesar el participante."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        message = "Participante creado exitosamente." if created else "Participante actualizado exitosamente."
        return Response({"message": message}, status=status.HTTP_200_OK)
