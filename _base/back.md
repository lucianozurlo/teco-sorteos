# sorteo_app/management/commands/cargar_csv.py

from django.core.management.base import BaseCommand, CommandError
import csv
from sorteo_app.models import Participante, RegistroActividad

class Command(BaseCommand):
    help = 'Carga datos de participantes desde CSV y excluye legajoss en la lista.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--usuarios',
            type=str,
            help='Ruta al archivo CSV de usuarios'
        )
        parser.add_argument(
            '--lista_negra',
            type=str,
            help='Ruta al archivo CSV de lista'
        )

    def handle(self, *args, **options):
        ruta_usuarios = options['usuarios'] or 'participantes.csv'
        ruta_lista_negra = options['lista_negra'] or 'no_incluidos.csv'

        # Leer IDs de la lista negra
        blacklist_ids = set()
        try:
            with open(ruta_lista_negra, 'r', encoding='utf-8') as f_black:
                reader = csv.DictReader(f_black)
                for row in reader:
                    blacklist_ids.add(int(row['ID']))
        except FileNotFoundError:
            raise CommandError(f"No se encontró el archivo: {ruta_lista_negra}")

        # Leer y crear/actualizar participantes (excluyendo los que estén en la lista negra)
        try:
            with open(ruta_usuarios, 'r', encoding='utf-8') as f_users:
                reader = csv.DictReader(f_users)
                contador = 0
                for row in reader:
                    user_id = int(row['ID'])
                    if user_id in blacklist_ids:
                        continue

                    Participante.objects.update_or_create(
                        id=user_id,
                        defaults={
                            'nombre': row['Nombre'],
                            'apellido': row['Apellido'],
                            'email': row['Email'],
                            'localidad': row['Localidad'],
                            'provincia': row['Provincia']
                        }
                    )
                    contador += 1

                self.stdout.write(self.style.SUCCESS(
                    f'Se cargaron/actualizaron {contador} participantes.'
                ))

                RegistroActividad.objects.create(
                    evento=f"Carga de participantes desde {ruta_usuarios}; no incluidos {len(blacklist_ids)} legajos."
                )
        except FileNotFoundError:
            raise CommandError(f"No se encontró el archivo de participantes: {ruta_usuarios}")



# sorteo_app/management/commands/load_premios.py

from django.core.management.base import BaseCommand
from sorteo_app.models import Premio
import random

class Command(BaseCommand):
    help = 'Carga 10 premios de prueba con stock aleatorio'

    def handle(self, *args, **kwargs):
        sample_premios = [
            'TV 42 pulgadas',
            'Smartphone Samsung Galaxy',
            'Laptop HP 15"',
            'Tablet iPad Pro',
            'Cámara Canon EOS',
            'Audífonos Bose',
            'Smartwatch Apple',
            'Televisor LG 55 pulgadas',
            'Consola PlayStation 5',
            'Bicicleta de montaña'
        ]

        for nombre in sample_premios:
            stock = random.randint(1, 10)
            premio, created = Premio.objects.get_or_create(nombre=nombre, defaults={'stock': stock})
            if created:
                self.stdout.write(self.style.SUCCESS(f'Creado premio: {nombre} con stock {stock}'))
            else:
                self.stdout.write(f'El premio {nombre} ya existe con stock {premio.stock}')




# sorteo_app/views/__init__.py

# Importar vistas de filtros
from .views_filters import listar_provincias, listar_localidades

# Importar vistas de sorteo
from .views_sorteo import (
    realizar_sorteo,
    ListadoSorteos,
    ListadoResultadosSorteo,
    ListadoRegistroActividad
)

# Importar vistas de subida de CSV
from .views_upload import UploadCSVView

__all__ = [
    'listar_provincias',
    'listar_localidades',
    'realizar_sorteo',
    'ListadoSorteos',
    'ListadoResultadosSorteo',
    'ListadoRegistroActividad',
    'UploadCSVView'
]




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




# sorteo_app/views/download_templates.py

import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class DownloadParticipantesTemplate(APIView):
    """
    Devuelve un archivo CSV con la plantilla para participantes.
    Orden de columnas: ['id', 'nombre', 'apellido', 'area', 'dominio', 'cargo', 'email', 'localidad', 'provincia']
    """
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        filename = "participantes_template.csv"
        headers = ['id', 'nombre', 'apellido', 'area', 'dominio', 'cargo', 'email', 'localidad', 'provincia']
        example_rows = [
            ['1', 'Juan', 'Pérez', 'Ventas', 'Negocio', 'Ejecutivo', 'juan.perez@example.com', 'La Plata', 'Buenos Aires'],
            ['2', 'María', 'González', 'Marketing', 'Digital', 'Analista', 'maria.gonzalez@example.com', 'Mar del Plata', 'Buenos Aires']
        ]
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        writer = csv.writer(response)
        writer.writerow(headers)
        for row in example_rows:
            writer.writerow(row)
        return response

class DownloadListaNegraTemplate(APIView):
    """
    Devuelve un archivo CSV con la plantilla para la lista negra.
    Se utiliza el mismo orden de columnas que para participantes, lo que permite incluir además del ID el nombre y los demás datos.
    """
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        filename = "lista_negra_template.csv"
        headers = ['id', 'nombre', 'apellido', 'area', 'dominio', 'cargo', 'email', 'localidad', 'provincia']
        example_rows = [
            ['10', 'Pedro', 'Suárez', 'Finanzas', 'Negocio', 'Analista', 'pedro.suarez@example.com', 'Buenos Aires', 'Buenos Aires'],
            ['11', 'Luciana', 'Rodríguez', 'Marketing', 'Digital', 'Coordinadora', 'luciana.rodriguez@example.com', 'Mar del Plata', 'Buenos Aires']
        ]
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        writer = csv.writer(response)
        writer.writerow(headers)
        for row in example_rows:
            writer.writerow(row)
        return response




# sorteo_app/views/views_lists.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Participante, ListaNegra

class ListLoadedData(APIView):
    """
    Devuelve el contenido actual:
      - Participantes: todos los registros de Participante.
      - Blacklist: cada registro de ListaNegra con todos sus datos.
    """
    def get(self, request):
        participantes = list(Participante.objects.values())
        blacklist = list(ListaNegra.objects.values())
        return Response({
            'participantes': participantes,
            'blacklist': blacklist,
        }, status=status.HTTP_200_OK)

class ClearParticipantes(APIView):
    """
    Elimina todos los registros de Participante.
    """
    def delete(self, request):
        deleted, _ = Participante.objects.all().delete()
        return Response({
            'message': 'Participantes eliminados',
            'deleted': deleted
        }, status=status.HTTP_200_OK)

class ClearListaNegra(APIView):
    """
    Elimina todos los registros de la Lista Negra.
    """
    def delete(self, request):
        deleted, _ = ListaNegra.objects.all().delete()
        return Response({
            'message': 'Lista eliminada',
            'deleted': deleted
        }, status=status.HTTP_200_OK)




# sorteo_app/views/views_filters.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Participante  # Asegurate de importar Participante, no User

@api_view(['GET'])
def listar_provincias(request):
    # Obtener provincias únicas de Participante
    provincias = Participante.objects.values_list('provincia', flat=True).distinct()
    provincias_list = sorted(provincias)
    return Response(provincias_list, status=status.HTTP_200_OK)

@api_view(['GET'])
def listar_localidades(request):
    provincia = request.GET.get('provincia')
    if provincia:
        localidades = Participante.objects.filter(provincia__iexact=provincia).values_list('localidad', flat=True).distinct()
    else:
        localidades = Participante.objects.values_list('localidad', flat=True).distinct()
    localidades_list = sorted(localidades)
    return Response(localidades_list, status=status.HTTP_200_OK)




# sorteo_app/views/views_sorteo.py

import random
from django.http import HttpRequest
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.generics import ListAPIView
from ..models import RegistroActividad, Sorteo, SorteoPremio, ResultadoSorteo, Premio, Participante
from ..serializers import SorteoSerializer, ResultadoSorteoSerializer

# Importa tus serializers
from ..serializers import (
    SorteoSerializer,
    ResultadoSorteoSerializer,
    RegistroActividadSerializer,
    PremioSerializer
)

# ViewSet para gestionar Premios
class PremioViewSet(viewsets.ModelViewSet):
    queryset = Premio.objects.all()
    serializer_class = PremioSerializer

@api_view(['POST'])
def realizar_sorteo(request):
    """
    Realiza un sorteo asignando premios a participantes.
    Se pueden filtrar los participantes por provincia y/o localidad si se incluyen en el payload.
    Se espera un JSON con, entre otros, las claves:
      - "provincia": (opcional) valor exacto a buscar.
      - "localidad": (opcional) valor exacto a buscar.
    """
    print("Payload recibido:", request.data)
    provincia = request.data.get('provincia')
    localidad = request.data.get('localidad')
    print("Filtro - provincia:", provincia, "localidad:", localidad)
    
    # Crear el sorteo con el serializer
    serializer = SorteoSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    try:
        sorteo = serializer.save()
    except Exception as e:
        return Response({'error': f"Error al crear el sorteo: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Filtrar participantes en el modelo Participante
    participantes_query = Participante.objects.all()
    if provincia:
        # Se usa iexact para comparación exacta (ignora mayúsculas/minúsculas)
        participantes_query = participantes_query.filter(provincia__iexact=provincia)
    if localidad:
        participantes_query = participantes_query.filter(localidad__iexact=localidad)
    
    participantes_disponibles = list(participantes_query)
    print("Cantidad de participantes disponibles después del filtro:", len(participantes_disponibles))
    
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
    
    # Calcular el total de premios
    try:
        premios_data = request.data.get('premios', [])
        total_premios = sum(item['cantidad'] for item in premios_data)
    except Exception as e:
        return Response({'error': f"Error en el campo 'premios': {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
    if total_premios > len(participantes_disponibles):
        return Response({'error': f"No hay suficientes participantes para asignar {total_premios} premios. Participantes disponibles: {len(participantes_disponibles)}."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    random.shuffle(participantes_disponibles)
    ganadores_info = []
    premios_sorted = SorteoPremio.objects.filter(sorteo=sorteo).order_by('orden_item')
    
    for sorteo_premio in premios_sorted:
        cantidad = sorteo_premio.cantidad
        premio = sorteo_premio.premio
        if cantidad > len(participantes_disponibles):
            return Response({'error': f"No hay suficientes participantes para asignar el premio '{premio.nombre}' (se requieren {cantidad}, disponibles {len(participantes_disponibles)})."},
                            status=status.HTTP_400_BAD_REQUEST)
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
                return Response({'error': f"Error al asignar el premio '{premio.nombre}' al participante ID {ganador.id}: {str(e)}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
            evento=f"Sorteo (ID={sorteo.id}) '{sorteo.nombre}' con {premios_sorted.count()} premios y {total_premios} ganadores."
        )
    except Exception as e:
        print(f"Error al registrar actividad: {str(e)}")
    
    data_response = {
        'sorteo_id': sorteo.id,
        'nombre_sorteo': sorteo.nombre,
        'items': ganadores_info
    }
    return Response(data_response, status=status.HTTP_200_OK)


class ListadoSorteos(ListAPIView):
    queryset = Sorteo.objects.all().order_by('-fecha_hora')
    serializer_class = SorteoSerializer

class ListadoResultadosSorteo(ListAPIView):
    queryset = ResultadoSorteo.objects.all()
    serializer_class = ResultadoSorteoSerializer

class ListadoRegistroActividad(ListAPIView):
    queryset = RegistroActividad.objects.all().order_by('-fecha_hora')
    serializer_class = RegistroActividadSerializer




# sorteo_app/views/views_upload.py

import csv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from io import TextIOWrapper
from ..models import RegistroActividad, Participante, ListaNegra

class UploadCSVView(APIView):
    """
    Permite subir de a un archivo:
      - usuarios.csv: Crea/actualiza Participante.
      - lista_negra.csv: Crea/actualiza ListaNegra con los datos completos del CSV.
    """
    def post(self, request, format=None):
        file_usuarios = request.FILES.get('usuarios')
        file_lista_negra = request.FILES.get('lista_negra')

        mensaje = {}
        total_excluidos = 0

        # Procesar CSV de lista negra (si se envía)
        if file_lista_negra:
            try:
                text_file_ln = TextIOWrapper(file_lista_negra.file, encoding='utf-8')
                reader_ln = csv.DictReader(text_file_ln)
                count_ln = 0
                errores_ln = []
                for row in reader_ln:
                    try:
                        user_id = int(row['ID'])
                        ListaNegra.objects.update_or_create(
                            id=user_id,
                            defaults={
                                'nombre': row.get('Nombre', '-').strip() or '-',
                                'apellido': row.get('Apellido', '-').strip() or '-',
                                'area': row.get('Area', '-').strip() or '-',
                                'dominio': row.get('Dominio', '-').strip() or '-',
                                'cargo': row.get('Cargo', '-').strip() or '-',
                                'email': row.get('Email', '-').strip() or '-',
                                'localidad': row.get('Localidad', '-').strip() or '-',
                                'provincia': row.get('Provincia', '-').strip() or '-',
                            }
                        )
                        count_ln += 1
                    except ValueError:
                        errores_ln.append(f"ID inválido en lista_negra: {row.get('ID')}")
                mensaje['lista_negra'] = f"Se procesaron {count_ln} registros en la lista."
                if errores_ln:
                    mensaje['errores_lista_negra'] = errores_ln
            except Exception as e:
                return Response({'error': f"Error al procesar lista_negra.csv: {str(e)}"},
                                status=status.HTTP_400_BAD_REQUEST)

        # Procesar CSV de usuarios (si se envía)
        if file_usuarios:
            contador = 0
            errores = []
            try:
                text_file_u = TextIOWrapper(file_usuarios.file, encoding='utf-8')
                reader_u = csv.DictReader(text_file_u)
                with transaction.atomic():
                    for row in reader_u:
                        try:
                            user_id = int(row['ID'])
                            # Si el usuario ya se encuentra en la lista negra, se omite
                            if ListaNegra.objects.filter(id=user_id).exists():
                                total_excluidos += 1
                                continue
                            Participante.objects.update_or_create(
                                id=user_id,
                                defaults={
                                    'nombre': row['Nombre'],
                                    'apellido': row['Apellido'],
                                    'area': row.get('Area', ''),
                                    'dominio': row.get('Dominio', ''),
                                    'cargo': row.get('Cargo', ''),
                                    'email': row['Email'],
                                    'localidad': row['Localidad'],
                                    'provincia': row['Provincia'],
                                }
                            )
                            contador += 1
                        except KeyError as e:
                            errores.append({'row': row, 'error': f'Campo faltante: {e}'})
                        except ValueError:
                            errores.append({'row': row, 'error': f'ID inválido: {row.get("ID")}'})
                        except Exception as e:
                            errores.append({'row': row, 'error': str(e)})
                RegistroActividad.objects.create(
                    evento=f"Carga de participantes desde archivo CSV; se cargaron/actualizaron {contador} participantes. No incluidos {total_excluidos}."
                )
                mensaje['usuarios'] = f"Se cargaron {contador} participantes. No incluidos {total_excluidos} registros."
                if errores:
                    mensaje['errores_usuarios'] = errores
            except Exception as e:
                return Response({'error': f"Error al procesar usuarios.csv: {str(e)}"},
                                status=status.HTTP_400_BAD_REQUEST)

        if not file_usuarios and not file_lista_negra:
            return Response({'error': 'Debe enviar al menos uno de los archivos.'},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(mensaje, status=status.HTTP_200_OK)




# sorteo_app/apps.py

from django.apps import AppConfig

class SorteoAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sorteo_app"




# sorteo_app/models.py

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    localidad = models.CharField(max_length=255)
    provincia = models.CharField(max_length=255)

    def __str__(self):
        return f'Perfil de {self.user.username}'

class Participante(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    area = models.CharField(max_length=255, blank=True, null=True)
    dominio = models.CharField(max_length=255, blank=True, null=True)
    cargo = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField()
    localidad = models.CharField(max_length=255)
    provincia = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

@receiver(post_save, sender=User)
def crear_guardar_perfil(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.profile.save()

class Premio(models.Model):
    nombre = models.CharField(max_length=255, unique=True)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nombre

class Sorteo(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    premios = models.ManyToManyField(Premio, through='SorteoPremio')
    fecha_hora = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class SorteoPremio(models.Model):
    sorteo = models.ForeignKey(Sorteo, on_delete=models.CASCADE, related_name='sorteopremios')
    premio = models.ForeignKey(Premio, on_delete=models.CASCADE)  # Quitamos el related_name aquí
    orden_item = models.PositiveIntegerField()
    cantidad = models.PositiveIntegerField()

    class Meta:
        unique_together = ('sorteo', 'premio')
        ordering = ['orden_item']

    def __str__(self):
        return f'{self.premio.nombre} en {self.sorteo.nombre} - Orden: {self.orden_item}, Cantidad: {self.cantidad}'


class ResultadoSorteo(models.Model):
    sorteo = models.ForeignKey(Sorteo, on_delete=models.CASCADE)
    participante = models.ForeignKey(Participante, on_delete=models.CASCADE)
    premio = models.ForeignKey(Premio, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.participante} ganó {self.premio} en {self.sorteo}"

class RegistroActividad(models.Model):
    evento = models.CharField(max_length=255)
    fecha_hora = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.evento} at {self.fecha_hora}"

class ListaNegra(models.Model):
    # Usamos la misma estructura que Participante, pero sin relación directa.
    id = models.IntegerField(primary_key=True)  # ID del participante (único)
    nombre = models.CharField(max_length=255, blank=True, default="-")
    apellido = models.CharField(max_length=255, blank=True, default="-")
    area = models.CharField(max_length=255, blank=True, default="-")
    dominio = models.CharField(max_length=255, blank=True, default="-")
    cargo = models.CharField(max_length=255, blank=True, default="-")
    # Para email, usamos CharField para permitir el valor "-" como default.
    email = models.CharField(max_length=255, blank=True, default="-")
    localidad = models.CharField(max_length=255, blank=True, default="-")
    provincia = models.CharField(max_length=255, blank=True, default="-")

    def __str__(self):
        return f"{self.id} - {self.nombre} {self.apellido}"




# sorteo_app/serializers.py

from rest_framework import serializers
# Importar los modelos usando importación relativa
from .models import Participante, RegistroActividad, Sorteo, SorteoPremio, ResultadoSorteo, Premio, UserProfile

# Serializer para UserProfile (si se usa en algún otro lado)
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['localidad', 'provincia']

# Serializer para Participante (en lugar de User)
class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = ['id', 'nombre', 'apellido', 'area', 'dominio', 'cargo', 'email', 'localidad', 'provincia']

class RegistroActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroActividad
        fields = '__all__'

class PremioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Premio
        fields = ['id', 'nombre', 'stock']

class SorteoPremioSerializer(serializers.ModelSerializer):
    premio = PremioSerializer(read_only=True)
    premio_id = serializers.PrimaryKeyRelatedField(queryset=Premio.objects.all(), source='premio', write_only=True)

    class Meta:
        model = SorteoPremio
        fields = ['premio', 'premio_id', 'orden_item', 'cantidad']

class SorteoSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sorteo
        fields = ['id', 'nombre']

class SorteoSerializer(serializers.ModelSerializer):
    premios = SorteoPremioSerializer(many=True, source='sorteopremios')

    class Meta:
        model = Sorteo
        fields = ['id', 'nombre', 'descripcion', 'fecha_hora', 'premios']

    def validate_nombre(self, value):
        if not value.strip():
            return "Sorteo sin nombre"
        return value

    def create(self, validated_data):
        premios_data = validated_data.pop('sorteopremios')
        sorteo = Sorteo.objects.create(**validated_data)
        for premio_data in premios_data:
            premio = premio_data['premio']
            orden_item = premio_data['orden_item']
            cantidad = premio_data['cantidad']

            if premio.stock < cantidad:
                raise serializers.ValidationError(f'No hay suficiente stock para el premio {premio.nombre}')

            premio.stock -= cantidad
            premio.save()

            SorteoPremio.objects.create(
                sorteo=sorteo,
                premio=premio,
                orden_item=orden_item,
                cantidad=cantidad
            )
        return sorteo

class ResultadoSorteoSerializer(serializers.ModelSerializer):
    participante = ParticipanteSerializer(read_only=True)
    premio = PremioSerializer(read_only=True)
    # Usamos un SerializerMethodField para el sorteo y devolver un dict con la info deseada.
    sorteo = serializers.SerializerMethodField()

    class Meta:
        model = ResultadoSorteo
        fields = ['id', 'sorteo', 'participante', 'premio', 'fecha']

    def get_sorteo(self, obj):
        # Devuelve un diccionario con el id y nombre del sorteo
        if obj.sorteo:
            return {'id': obj.sorteo.id, 'nombre': obj.sorteo.nombre}
        return None




# sorteo_project/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from sorteo_app.views import (
    UploadCSVView,
    realizar_sorteo,
    ListadoSorteos,
    ListadoResultadosSorteo,
    ListadoRegistroActividad,
    listar_provincias, 
    listar_localidades
)
from sorteo_app.views.views_sorteo import PremioViewSet
from sorteo_app.views.download_templates import DownloadParticipantesTemplate, DownloadListaNegraTemplate
from sorteo_app.views.views_lists import ListLoadedData, ClearParticipantes, ClearListaNegra
from sorteo_app.views.blacklist import AddToBlacklist
from sorteo_app.views.add_participant import AddToParticipants

router = routers.DefaultRouter()
router.register(r'premios', PremioViewSet, basename='premio')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/upload_csv/', UploadCSVView.as_view(), name='upload_csv'),
    path('api/lists/', ListLoadedData.as_view(), name='list_loaded_data'),
    path('api/lists/clear/participantes/', ClearParticipantes.as_view(), name='clear_participantes'),
    path('api/lists/clear/blacklist/', ClearListaNegra.as_view(), name='clear_blacklist'),
    path('api/blacklist/add/', AddToBlacklist.as_view(), name='add_to_blacklist'),
    path('api/participants/add/', AddToParticipants.as_view(), name='add_to_participants'),
    path('api/download_template/participantes/', DownloadParticipantesTemplate.as_view(), name='download_template_participantes'),
    path('api/download_template/lista_negra/', DownloadListaNegraTemplate.as_view(), name='download_template_lista_negra'),
    path('api/sortear/', realizar_sorteo, name='realizar_sorteo'),
    path('api/sorteos/', ListadoSorteos.as_view(), name='listado_sorteos'),
    path('api/resultados_sorteo/', ListadoResultadosSorteo.as_view(), name='listado_resultados_sorteo'),
    path('api/registro_actividad/', ListadoRegistroActividad.as_view(), name='listado_registro_actividad'),
    path('api/provincias/', listar_provincias, name='listar_provincias'),
    path('api/localidades/', listar_localidades, name='listar_localidades'),
    path('api/', include(router.urls)),
]




# sorteo_project/settings.py

"""
Django settings for sorteo_project project.
Generated by 'django-admin startproject' using Django 5.1.5.
Para más información, visita https://docs.djangoproject.com/en/5.1/topics/settings/
y https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import dj_database_url
from dotenv import load_dotenv
import os

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-*!)y=(x-y1vj5s5i^y5a_zv(4z1&wvl%f00umni1x6cv@8hwd2"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['web-production-0252.up.railway.app', 'localhost', '127.0.0.1']

# DATABASE
ENV = os.getenv('ENV', 'development')  # Por defecto development

if ENV == 'development':
    DEBUG = True
    # Para desarrollo usaremos SQLite
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / "db.sqlite3",
        }
    }
else:
    DEBUG = False
    # En producción usaremos Railway (ya tienes configurado dj_database_url)
    DATABASES = {
        'default': dj_database_url.config(
            default=os.getenv('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True
        )
    }


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "whitenoise.runserver_nostatic",

    # Apps de terceros
    'rest_framework',
    'corsheaders',

    # Tu app
    'sorteo_app'
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'corsheaders.middleware.CorsMiddleware'
]

# Configurar CORS
CORS_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://teco-sorteos.netlify.app",
]
CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = "sorteo_project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "sorteo_project.wsgi.application"

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
# TIME_ZONE = 'America/Argentina/Buenos_Aires'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

STATICFILES_DIRS = [
    os.path.join(BASE_DIR,'sorteo_app/static')
]

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    }
}

CSRF_TRUSTED_ORIGINS = ["http://*", "https://web-production-0252.up.railway.app"]




# Procfile

web: python manage.py collectstatic --noinput && gunicorn sorteo_project.wsgi --log-file -




# netlify.py

[build]
  command = "npm run build"
  publish = "build"

[context.production.environment]
  # Establece la URL base de la API para producción.
  REACT_APP_API_BASE_URL = "https://web-production-0252.up.railway.app"

[[redirects]]
  from = "/sorteo"
  to = "/"
  status = 301
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200




