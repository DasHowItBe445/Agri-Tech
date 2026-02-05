from rest_framework import serializers
from .models import Farmer, ProduceRecord, QualityMetrics, Transaction, LabReport

class LabReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabReport
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class QualityMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityMetrics
        fields = '__all__'

class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = '__all__'

class ProduceRecordSerializer(serializers.ModelSerializer):
    metrics = QualityMetricsSerializer(read_only=True)
    farmer_name = serializers.ReadOnlyField(source='farmer.name')

    class Meta:
        model = ProduceRecord
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
