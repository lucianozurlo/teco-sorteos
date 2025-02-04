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