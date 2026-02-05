# Generated migration for LabReport model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LabReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report_image', models.ImageField(upload_to='lab_reports/')),
                ('sample_id', models.CharField(blank=True, max_length=100, null=True)),
                ('lab_name', models.CharField(blank=True, max_length=255, null=True)),
                ('report_date', models.DateField(blank=True, null=True)),
                ('ph_value', models.FloatField(blank=True, null=True)),
                ('ph_status', models.CharField(blank=True, max_length=50, null=True)),
                ('nitrogen_value', models.FloatField(blank=True, null=True)),
                ('nitrogen_status', models.CharField(blank=True, max_length=50, null=True)),
                ('phosphorus_value', models.FloatField(blank=True, null=True)),
                ('phosphorus_status', models.CharField(blank=True, max_length=50, null=True)),
                ('potassium_value', models.FloatField(blank=True, null=True)),
                ('potassium_status', models.CharField(blank=True, max_length=50, null=True)),
                ('organic_carbon_value', models.FloatField(blank=True, null=True)),
                ('organic_carbon_status', models.CharField(blank=True, max_length=50, null=True)),
                ('grade', models.CharField(choices=[('A', 'Grade A'), ('B', 'Grade B'), ('C', 'Grade C')], max_length=1)),
                ('grade_description', models.TextField()),
                ('out_of_range_count', models.IntegerField(default=0)),
                ('issues', models.JSONField(default=list)),
                ('blockchain_hash', models.CharField(blank=True, max_length=255, null=True)),
                ('on_chain_status', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'lab_report',
                'ordering': ['-created_at'],
            },
        ),
    ]
