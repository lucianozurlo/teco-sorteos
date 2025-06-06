# sorteo_app/serializers.py

from rest_framework import serializers
from .models import Participante, RegistroActividad, Sorteo, SorteoPremio, ResultadoSorteo, Premio, UserProfile, SorteoSnapshot

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['localidad', 'provincia']

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
    premio_id = serializers.PrimaryKeyRelatedField(queryset=Premio.objects.all(), source='premio')

    class Meta:
        model = SorteoPremio
        fields = ['premio', 'premio_id', 'orden_item', 'cantidad']

class SorteoSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sorteo
        fields = ['id', 'nombre']

class SorteoSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = SorteoSnapshot
        fields = '__all__'
                
class SorteoSerializer(serializers.ModelSerializer):
    premios = SorteoPremioSerializer(many=True, source='sorteopremios')

    class Meta:
        model = Sorteo
        fields = [
            'id',
            'nombre',
            'descripcion',
            'fecha_hora',
            'fecha_programada',
            'provincia',
            'localidad',
            'premios'
        ]

    def validate_nombre(self, value):
        if not value.strip():
            return "Sorteo sin nombre"
        return value

    def create(self, validated_data):
        premios_data = validated_data.pop('sorteopremios', [])
        sorteo = Sorteo.objects.create(**validated_data)
        for premio_data in premios_data:
            premio = premio_data['premio']
            orden_item = premio_data['orden_item']
            cantidad = premio_data['cantidad']

            if premio.stock < cantidad:
                raise serializers.ValidationError(f'No hay suficiente stock para el premio {premio.nombre}')

            # Si el sorteo se realiza (no se agenda) se descuenta el stock.
            if not validated_data.get('fecha_programada'):
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
    sorteo = serializers.SerializerMethodField()

    class Meta:
        model = ResultadoSorteo
        fields = ['id', 'sorteo', 'participante', 'premio', 'fecha']

    def get_sorteo(self, obj):
        if obj.sorteo:
            return {'id': obj.sorteo.id, 'nombre': obj.sorteo.nombre}
        return None
