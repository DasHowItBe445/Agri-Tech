import requests
import hashlib
import uuid
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from .models import Farmer, ProduceRecord, QualityMetrics, Transaction
from .serializers import (
    FarmerSerializer, 
    ProduceRecordSerializer, 
    QualityMetricsSerializer, 
    TransactionSerializer
)
from blockchain.contract_interaction import ContractInteraction

class FarmerViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer

class QualityMetricsViewSet(viewsets.ModelViewSet):
    queryset = QualityMetrics.objects.all()
    serializer_class = QualityMetricsSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    @action(detail=False, methods=['get'])
    def list_available(self, request):
        # Implementation for /api/marketplace/list
        queryset = ProduceRecord.objects.filter(on_chain_status=True)
        serializer = ProduceRecordSerializer(queryset, many=True)
        return Response(serializer.data)

class ProduceRecordViewSet(viewsets.ModelViewSet):
    queryset = ProduceRecord.objects.all()
    serializer_class = ProduceRecordSerializer

    # FULL FLOW ROUTE: Camera -> AI -> DB -> Blockchain -> User
    @action(detail=False, methods=['post'])
    def full_pipeline(self, request):
        """
        1. Camera (fetch): Request contains the image from frontend
        2. Model's API (post): Calls FastAPI for grading
        3. Database (post): Saves metrics and produce records
        4. Blockchain (post): Records quality hash on-chain
        5. Again to User: Returns the full digital passport
        """
        # 1. Fetch from camera (request data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        produce_record = serializer.save()

        # 2. Call AI Service (FastAPI)
        analysis_data = self._call_ai_service(produce_record)
        
        if not analysis_data:
            return Response({"error": "AI service analysis failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 3. Save to Database (PostgreSQL)
        metrics = QualityMetrics.objects.create(
            grade=analysis_data.get('grade'),
            confidence_score=analysis_data.get('confidence_score'),
            freshness_score=analysis_data.get('freshness_score'),
            color_saturation=analysis_data.get('color_saturation'),
            surface_defects=analysis_data.get('surface_defects')
        )
        
        produce_record.metrics = metrics
        produce_record.passport_id = f"KP-{uuid.uuid4().hex[:8].upper()}"
        
        # 4. Save to Blockchain (Post)
        quality_data_string = f"{produce_record.passport_id}-{metrics.grade}-{metrics.freshness_score}"
        quality_hash = hashlib.sha256(quality_data_string.encode()).hexdigest()
        
        blockchain = ContractInteraction()
        tx_hash = blockchain.record_quality_on_chain(produce_record.passport_id, quality_hash)
        
        if tx_hash:
            produce_record.blockchain_hash = tx_hash
            produce_record.on_chain_status = True
        
        produce_record.save()
        
        # 5. Again to User (Response)
        return Response(self.get_serializer(produce_record).data, status=status.HTTP_201_CREATED)

    # POST /api/produce/create
    @action(detail=False, methods=['post'])

    # GET /api/produce/farmer/{id}
    @action(detail=False, methods=['get'], url_path='farmer/(?P<farmer_id>[^/.]+)')
    def get_farmer_produce(self, request, farmer_id=None):
        queryset = ProduceRecord.objects.filter(farmer_id=farmer_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # POST /api/produce/{id}/verify
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        produce_record = self.get_object()
        
        if produce_record.on_chain_status:
            return Response({"message": "Already verified", "hash": produce_record.blockchain_hash})

        if not produce_record.metrics:
            return Response({"error": "No quality metrics found to verify"}, status=status.HTTP_400_BAD_REQUEST)

        quality_data_string = f"{produce_record.passport_id}-{produce_record.metrics.grade}-{produce_record.metrics.freshness_score}"
        quality_hash = hashlib.sha256(quality_data_string.encode()).hexdigest()
        
        blockchain = ContractInteraction()
        tx_hash = blockchain.record_quality_on_chain(produce_record.passport_id, quality_hash)
        
        if tx_hash:
            produce_record.blockchain_hash = tx_hash
            produce_record.on_chain_status = True
            produce_record.save()
            return Response({"message": "Successfully verified on-chain", "hash": tx_hash})
        
        return Response({"error": "Blockchain recording failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _call_ai_service(self, produce_record):
        url = f"{settings.FASTAPI_SERVICE_URL}/api/analyze"
        try:
            with open(produce_record.image.path, 'rb') as img_file:
                files = {'file': img_file}
                response = requests.post(url, files=files)
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            print(f"Error calling AI service: {e}")
        return None
