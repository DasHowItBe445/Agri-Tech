from django.contrib import admin
from .models import Farmer, ProduceRecord, QualityMetrics, Transaction

@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'location', 'created_at')

@admin.register(QualityMetrics)
class QualityMetricsAdmin(admin.ModelAdmin):
    list_display = ('grade', 'confidence_score', 'freshness_score', 'captured_at')

@admin.register(ProduceRecord)
class ProduceRecordAdmin(admin.ModelAdmin):
    list_display = ('passport_id', 'farmer', 'on_chain_status', 'created_at')
    readonly_fields = ('blockchain_hash',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('produce_record', 'buyer_name', 'price', 'status', 'transaction_date')
