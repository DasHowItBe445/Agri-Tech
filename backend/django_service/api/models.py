from django.db import models

class LabReport(models.Model):
    """Stores soil lab report analysis results"""
    # Report metadata
    report_image = models.ImageField(upload_to='lab_reports/')
    sample_id = models.CharField(max_length=100, null=True, blank=True)
    lab_name = models.CharField(max_length=255, null=True, blank=True)
    report_date = models.DateField(null=True, blank=True)
    
    # Soil parameters
    ph_value = models.FloatField(null=True, blank=True)
    ph_status = models.CharField(max_length=50, null=True, blank=True)
    nitrogen_value = models.FloatField(null=True, blank=True)
    nitrogen_status = models.CharField(max_length=50, null=True, blank=True)
    phosphorus_value = models.FloatField(null=True, blank=True)
    phosphorus_status = models.CharField(max_length=50, null=True, blank=True)
    potassium_value = models.FloatField(null=True, blank=True)
    potassium_status = models.CharField(max_length=50, null=True, blank=True)
    organic_carbon_value = models.FloatField(null=True, blank=True)
    organic_carbon_status = models.CharField(max_length=50, null=True, blank=True)
    
    # Grading results
    grade = models.CharField(max_length=1, choices=[('A', 'Grade A'), ('B', 'Grade B'), ('C', 'Grade C')])
    grade_description = models.TextField()
    out_of_range_count = models.IntegerField(default=0)
    issues = models.JSONField(default=list)
    
    # Blockchain integration (for future)
    blockchain_hash = models.CharField(max_length=255, null=True, blank=True)
    on_chain_status = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lab_report'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Lab Report {self.sample_id or self.id} - Grade {self.grade}"

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
