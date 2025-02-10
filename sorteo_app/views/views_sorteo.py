# sorteo_app/views/views_sorteo.py
import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.generics import ListAPIView
from ..models import RegistroActividad, Sorteo, SorteoPremio, ResultadoSorteo, Premio, Participante
from ..serializers import SorteoSerializer, ResultadoSorteoSerializer, RegistroActividadSerializer, PremioSerializer

class PremioViewSet(viewsets.ModelViewSet):
    queryset = Premio.objects.all()
    serializer_class = PremioSerializer

@api_view(['POST'])
def realizar_sorteo(request):
    """
    Realiza o agenda un sorteo.
    Si se proporciona "fecha_programada", se agenda; de lo contrario, se ejecuta.
    """
    provincia = request.data.get('provincia')
    localidad = request.data.get('localidad')
    serializer = SorteoSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    try:
        sorteo = serializer.save()
    except Exception as e:
        return Response({'error': f"Error al crear el sorteo: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not sorteo.fecha_programada:
        participantes_query = Participante.objects.all()
        if provincia:
            participantes_query = participantes_query.filter(provincia__iexact=provincia)
        if localidad:
            participantes_query = participantes_query.filter(localidad__iexact=localidad)
        participantes_disponibles = list(participantes_query)
        if not participantes_disponibles:
            error_msg = "No se encontraron participantes"
            if provincia and localidad:
                error_msg += f" para la provincia '{provincia}' y localidad '{localidad}'."
            elif provincia:
                error_msg += f" para la provincia '{provincia}'."
            elif localidad:
                error_msg += f" para la localidad '{localidad}'."
            else:
                error_msg += "."
            return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)
        try:
            premios_data = request.data.get('premios', [])
            total_premios = sum(item['cantidad'] for item in premios_data)
        except Exception as e:
            return Response({'error': f"Error en el campo 'premios': {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        if total_premios > len(participantes_disponibles):
            return Response({'error': f"No hay suficientes participantes para asignar {total_premios} premios. Participantes disponibles: {len(participantes_disponibles)}."}, status=status.HTTP_400_BAD_REQUEST)
        random.shuffle(participantes_disponibles)
        ganadores_info = []
        premios_sorted = SorteoPremio.objects.filter(sorteo=sorteo).order_by('orden_item')
        for sorteo_premio in premios_sorted:
            cantidad = sorteo_premio.cantidad
            premio = sorteo_premio.premio
            if cantidad > len(participantes_disponibles):
                return Response({'error': f"No hay suficientes participantes para asignar el premio '{premio.nombre}' (se requieren {cantidad}, disponibles {len(participantes_disponibles)})."}, status=status.HTTP_400_BAD_REQUEST)
            ganadores = participantes_disponibles[:cantidad]
            participantes_disponibles = participantes_disponibles[cantidad:]
            ganadores_data = []
            for ganador in ganadores:
                try:
                    ResultadoSorteo.objects.create(
                        sorteo=sorteo,
                        participante=ganador,
                        premio=premio
                    )
                except Exception as e:
                    return Response({'error': f"Error al asignar el premio '{premio.nombre}' al participante ID {ganador.id}: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                ganadores_data.append({
                    'id_ganador': ganador.id,
                    'nombre': ganador.nombre,
                    'apellido': ganador.apellido,
                    'email': ganador.email,
                })
            ganadores_info.append({
                'nombre_item': premio.nombre,
                'orden_item': sorteo_premio.orden_item,
                'cantidad': cantidad,
                'ganadores': ganadores_data
            })
        try:
            RegistroActividad.objects.create(
                evento=f"Sorteo (ID={sorteo.id}) '{sorteo.nombre}' realizado con {premios_sorted.count()} premios y {total_premios} ganadores."
            )
        except Exception as e:
            print(f"Error al registrar actividad: {str(e)}")
        data_response = {
            'sorteo_id': sorteo.id,
            'nombre_sorteo': sorteo.nombre,
            'items': ganadores_info
        }
        return Response(data_response, status=status.HTTP_200_OK)
    else:
        try:
            RegistroActividad.objects.create(
                evento=f"Sorteo agendado (ID={sorteo.id}) '{sorteo.nombre}' creado."
            )
        except Exception as e:
            print(f"Error al registrar actividad: {str(e)}")
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
