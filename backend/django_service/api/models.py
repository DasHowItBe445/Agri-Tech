from django.db import models

class Farmer(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, unique=True)
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'farmer'

    def __str__(self):
        return self.name

class QualityMetrics(models.Model):
    grade = models.CharField(max_length=10)
    confidence_score = models.FloatField()
    freshness_score = models.FloatField()
    color_saturation = models.FloatField(null=True, blank=True)
    surface_defects = models.JSONField(null=True, blank=True)
    captured_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'qualitymetrics'

class ProduceRecord(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='produce_images/')
    metrics = models.OneToOneField(QualityMetrics, on_delete=models.SET_NULL, null=True, blank=True)
    passport_id = models.CharField(max_length=100, unique=True)
    blockchain_hash = models.CharField(max_length=255, null=True, blank=True)
    on_chain_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'producerecord'

class Transaction(models.Model):
    produce_record = models.ForeignKey(ProduceRecord, on_delete=models.CASCADE)
    buyer_name = models.CharField(max_length=255, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    transaction_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Pending')

    class Meta:
        db_table = 'transaction'
