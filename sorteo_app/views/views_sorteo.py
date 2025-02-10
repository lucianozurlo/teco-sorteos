# sorteo_app/views/views_sorteo.py

import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.generics import ListAPIView
from ..models import RegistroActividad, Sorteo, SorteoPremio, ResultadoSorteo, Premio, Participante, SorteoSnapshot
from ..serializers import (
    SorteoSerializer,
    ResultadoSorteoSerializer,
    RegistroActividadSerializer,
    PremioSerializer
)
from django.utils import timezone

class PremioViewSet(viewsets.ModelViewSet):
    queryset = Premio.objects.all()
    serializer_class = PremioSerializer

@api_view(['POST'])
def realizar_sorteo(request):
    # Lógica existente para validar datos, crear el sorteo, filtrar participantes, etc.
    serializer = SorteoSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    try:
        sorteo = serializer.save()
    except Exception as e:
        return Response({'error': f"Error al crear el sorteo: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Supongamos que, si el sorteo es inmediato, procedemos a asignar ganadores y a descontar stock.
    if not sorteo.fecha_programada:
        # Filtrar participantes según filtros (o tomar todos)
        participantes_query = Participante.objects.all()
        provincia = request.data.get('provincia')
        localidad = request.data.get('localidad')
        if provincia:
            participantes_query = participantes_query.filter(provincia__iexact=provincia)
        if localidad:
            participantes_query = participantes_query.filter(localidad__iexact=localidad)
        participantes_disponibles = list(participantes_query)
        
        # Validar cantidad de participantes vs cantidad de premios
        premios_data = request.data.get('premios', [])
        total_premios = sum(item['cantidad'] for item in premios_data)
        if total_premios > len(participantes_disponibles):
            return Response(
                {'error': f"No hay suficientes participantes para asignar {total_premios} premios."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mezclar participantes y asignar premios de forma aleatoria (lógica existente)
        import random
        random.shuffle(participantes_disponibles)
        winners_info = []
        # Aquí se asume que la lógica asigna ganadores y se crea un ResultadoSorteo para cada asignación
        for premio_data in premios_data:
            cantidad = premio_data['cantidad']
            premio_id = premio_data['premio_id']
            premio = Premio.objects.get(id=premio_id)
            if cantidad > len(participantes_disponibles):
                return Response(
                    {'error': f"No hay suficientes participantes para asignar el premio {premio.nombre}."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            ganadores = participantes_disponibles[:cantidad]
            participantes_disponibles = participantes_disponibles[cantidad:]
            for ganador in ganadores:
                resultado = ResultadoSorteo.objects.create(
                    sorteo=sorteo,
                    participante=ganador,
                    premio=premio
                )
                winners_info.append({
                    'id': ganador.id,
                    'nombre': ganador.nombre,
                    'apellido': ganador.apellido,
                    'email': ganador.email,
                })
        
        # Para el snapshot, se guarda la base de participantes que estuvieron disponibles para el sorteo.
        participants_info = []
        # Se pueden incluir todos los que estaban disponibles (antes de asignar ganadores)
        # o, alternativamente, la lista completa que se usó para sortear.
        # Aquí se asume que se guardan todos los participantes que estuvieron en el sorteo.
        # Por ejemplo, usando la consulta original:
        for p in Participante.objects.all():
            participants_info.append({
                'id': p.id,
                'nombre': p.nombre,
                'apellido': p.apellido,
                'email': p.email,
            })
        
        # Crear el snapshot del sorteo
        # Supongamos que winners_info es la lista de ganadores (ya obtenida en tu lógica)
        SorteoSnapshot.objects.create(
            sorteo=sorteo,
            nombre=sorteo.nombre,
            descripcion=sorteo.descripcion,
            fecha_realizado=timezone.now(),
            participantes=participants_info,
            ganadores=winners_info,
        )

        # Registrar la actividad (si se hace)
        RegistroActividad.objects.create(
            evento=f"Sorteo (ID={sorteo.id}) '{sorteo.nombre}' realizado con {total_premios} premios."
        )
        
        data_response = {
            'sorteo_id': sorteo.id,
            'nombre_sorteo': sorteo.nombre,
            'items': winners_info,
        }
        return Response(data_response, status=status.HTTP_200_OK)
    else:
        # Si el sorteo está agendado, solo se registra la actividad sin asignar ganadores
        RegistroActividad.objects.create(
            evento=f"Sorteo agendado (ID={sorteo.id}) '{sorteo.nombre}' creado."
        )
        return Response({'message': f"Sorteo agendado (ID={sorteo.id}) creado."}, status=status.HTTP_200_OK)
    
class ListadoSorteos(ListAPIView):
    queryset = Sorteo.objects.all().order_by('-fecha_hora')
    serializer_class = SorteoSerializer

class ListadoResultadosSorteo(ListAPIView):
    queryset = ResultadoSorteo.objects.all()
    serializer_class = ResultadoSorteoSerializer

class ListadoRegistroActividad(ListAPIView):
    queryset = RegistroActividad.objects.all().order_by('-fecha_hora')
    serializer_class = RegistroActividadSerializer
