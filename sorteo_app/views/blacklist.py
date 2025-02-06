# sorteo_app/views/blacklist.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import ListaNegra, Participante

class AddToBlacklist(APIView):
    """
    Permite agregar individualmente un participante a la lista negra.
    Se espera recibir un JSON con el campo "id". Si el participante ya existe en la base de participantes,
    se tomarán sus datos para la lista negra; de lo contrario, se usarán valores por defecto ("-").
    Además, se eliminará el registro de la tabla Participante para que no figure en ambas listas.
    """
    def post(self, request, format=None):
        participant_id = request.data.get('id')
        if not participant_id:
            return Response({"error": "Falta el legajo del participante."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            participant_id = int(participant_id)
        except ValueError:
            return Response({"error": "El id debe ser un número."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Intentar obtener el participante para usar sus datos
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
        
        # Actualiza o crea el registro en ListaNegra
        obj, created = ListaNegra.objects.update_or_create(
            id=participant_id,
            defaults=defaults_data
        )
        
        # Elimina el registro de Participante si existe (para evitar duplicidad)
        if Participante.objects.filter(id=participant_id).exists():
            Participante.objects.filter(id=participant_id).delete()
        
        if created:
            return Response({"message": "Participante agregado a la lista de no incluidos."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "El participante ya se encontraba en la lista."}, status=status.HTTP_200_OK)
