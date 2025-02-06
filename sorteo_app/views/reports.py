# sorteo_app/views/reports.py

import logging
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import RegistroActividad, Participante, ListaNegra

logger = logging.getLogger(__name__)

class ReportesView(APIView):
    """
    Endpoint para obtener el historial de actividades (RegistroActividad)
    y otros logs relevantes.
    """
    def get(self, request, format=None):
        try:
            logs = list(RegistroActividad.objects.all().order_by('-fecha_hora').values())
        except Exception as e:
            logger.error("Error obteniendo logs: %s", e)
            return Response({"error": "Error interno al obtener los logs."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"logs": logs}, status=status.HTTP_200_OK)

class EstadisticasView(APIView):
    """
    Devuelve estadísticas básicas, por ejemplo:
      - Número total de participantes.
      - Número total en la lista negra.
      - Número total de sorteos realizados (según RegistroActividad, si lo deseas).
    """
    def get(self, request, format=None):
        try:
            total_participantes = Participante.objects.count()
            total_blacklist = ListaNegra.objects.count()
            total_actividades = RegistroActividad.objects.count()
        except Exception as e:
            logger.error("Error obteniendo estadísticas: %s", e)
            return Response({"error": "Error interno al obtener las estadísticas."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        data = {
            "total_participantes": total_participantes,
            "total_blacklist": total_blacklist,
            "total_actividades": total_actividades,
        }
        return Response(data, status=status.HTTP_200_OK)

class ScheduleSorteoView(APIView):
    """
    Stub para programación de sorteos.
    Aquí se podría implementar la lógica para agendar sorteos en fechas y horas específicas,
    por ejemplo, integrando Celery y Django-Celery-Beat para tareas programadas.
    """
    def post(self, request, format=None):
        # Ejemplo: recibir payload con 'fecha' y 'sorteo_id' (o datos para crear el sorteo)
        # y programar la ejecución del sorteo.
        # Se recomienda usar Celery para tareas asíncronas y programadas.
        data = request.data
        # Validar datos y programar la tarea.
        # Por ahora devolvemos un stub.
        return Response({"message": "Sorteo programado (stub)."}, status=status.HTTP_200_OK)
