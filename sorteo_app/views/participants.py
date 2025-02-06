# sorteo_app/views/participants.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Participante, ListaNegra

class AddToParticipants(APIView):
    """
    Permite agregar manualmente un participante a la base de Participante.
    Se esperan en el JSON los campos: id, nombre, apellido y email (obligatorios),
    y opcionalmente: área, dominio, cargo, localidad, provincia.
    Si el participante existe en la lista de no incluidos, se lo remueve de allí.
    """
    def post(self, request, format=None):
        data = request.data
        # Verificar campos requeridos
        for campo in ['id', 'nombre', 'apellido', 'email']:
            if not data.get(campo):
                return Response({"error": f"El campo {campo} es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            legajo = int(data.get('id'))
        except ValueError:
            return Response({"error": "El legajo debe ser un número."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Remover de ListaNegra si existe
        ListaNegra.objects.filter(id=legajo).delete()
        
        participante, created = Participante.objects.update_or_create(
            id=legajo,
            defaults={
                'nombre': data.get('nombre'),
                'apellido': data.get('apellido'),
                'email': data.get('email'),
                'area': data.get('area', ''),
                'dominio': data.get('dominio', ''),
                'cargo': data.get('cargo', ''),
                'localidad': data.get('localidad', ''),
                'provincia': data.get('provincia', ''),
            }
        )
        if created:
            message = "Participante agregado exitosamente."
        else:
            message = "Participante actualizado exitosamente."
        return Response({"message": message}, status=status.HTTP_200_OK)
