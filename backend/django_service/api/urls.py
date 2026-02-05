from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmerViewSet, 
    ProduceRecordViewSet, 
    TransactionViewSet,
    LabReportViewSet
)

urlpatterns = [
    # Lab Report Endpoints
    path('lab-reports/', LabReportViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('lab-reports/analyze', LabReportViewSet.as_view({'post': 'analyze'})),
    path('lab-reports/<int:pk>/', LabReportViewSet.as_view({'get': 'retrieve'})),
    path('lab-reports/<int:pk>/passport', LabReportViewSet.as_view({'get': 'passport'})),

    # Farmer Endpoints
    path('farmers/', FarmerViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('farmers/<int:pk>/', FarmerViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    # Produce Endpoints (Matching Image)
    path('produce/create', ProduceRecordViewSet.as_view({'post': 'create_record'})),
    path('produce/full-pipeline', ProduceRecordViewSet.as_view({'post': 'full_pipeline'})),
    path('produce/<int:pk>', ProduceRecordViewSet.as_view({'get': 'retrieve'})),
    path('produce/farmer/<int:farmer_id>', ProduceRecordViewSet.as_view({'get': 'get_farmer_produce'})),
    path('produce/<int:pk>/verify', ProduceRecordViewSet.as_view({'post': 'verify'})),

    # Marketplace Endpoints (Matching Image)
    path('marketplace/list', TransactionViewSet.as_view({'get': 'list_available'})),
]
