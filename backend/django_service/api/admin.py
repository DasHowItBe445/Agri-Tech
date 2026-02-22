from django.contrib import admin
from .models import Farmer, ProduceRecord, QualityMetrics, Transaction, LabReport

@admin.register(LabReport)
class LabReportAdmin(admin.ModelAdmin):
    list_display = ('sample_id', 'lab_name', 'grade', 'report_date', 'created_at')
    search_fields = ('sample_id', 'lab_name')


@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'location', 'created_at')

@admin.register(QualityMetrics)
class QualityMetricsAdmin(admin.ModelAdmin):
    list_display = ('grade', 'lab_report_grade', 'confidence_score', 'freshness_score', 'captured_at')
    search_fields = ('grade', 'lab_report_grade')

@admin.register(ProduceRecord)
class ProduceRecordAdmin(admin.ModelAdmin):
    list_display = ('passport_id', 'farmer', 'on_chain_status', 'created_at')
    readonly_fields = ('blockchain_hash',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('produce_record', 'buyer_name', 'price', 'status', 'transaction_date')
