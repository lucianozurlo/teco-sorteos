# sorteo_app/views/add_participant.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Participante, ListaNegra

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

    (*) Requerido.
    Además, si el legajo ya se encuentra en la lista negra, se elimina para no duplicar.
    """
    def post(self, request, format=None):
        data = request.data
        required_fields = ['id', 'nombre', 'apellido', 'email']
        missing = [field for field in required_fields if field not in data or not str(data[field]).strip()]
        if missing:
            return Response(
                {"error": f"Faltan campos requeridos: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            legajo = int(data['id'])
        except ValueError:
            return Response(
                {"error": "El legajo (id) debe ser un número."},
                status=status.HTTP_400_BAD_REQUEST
            )

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
        
        # Si el participante está en la lista negra, se elimina para evitar duplicidad
        if ListaNegra.objects.filter(id=legajo).exists():
            ListaNegra.objects.filter(id=legajo).delete()

        if created:
            message = "Participante creado exitosamente."
        else:
            message = "Participante actualizado exitosamente."
        return Response({"message": message}, status=status.HTTP_200_OK)
