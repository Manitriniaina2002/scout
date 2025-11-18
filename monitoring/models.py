from django.db import models
from django.utils import timezone


class Metric(models.Model):
    """Model for storing infrastructure metrics"""
    METRIC_TYPES = [
        ('network', 'Network'),
        ('server', 'Server'),
        ('firewall', 'Firewall'),
    ]
    
    metric_type = models.CharField(max_length=20, choices=METRIC_TYPES, db_index=True)
    value = models.FloatField()
    unit = models.CharField(max_length=20, default='')
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    source = models.CharField(max_length=100)
    is_anomaly = models.BooleanField(default=False)
    anomaly_score = models.FloatField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp', 'metric_type']),
        ]
    
    def __str__(self):
        return f"{self.metric_type} - {self.value}{self.unit} at {self.timestamp}"


class Alert(models.Model):
    """Model for storing alerts"""
    SEVERITY_CHOICES = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    ]
    
    metric_type = models.CharField(max_length=20, db_index=True)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, db_index=True)
    message = models.TextField()
    value = models.FloatField()
    threshold = models.FloatField()
    ai_analysis = models.TextField(blank=True, null=True)
    recommendations = models.JSONField(default=list, blank=True)
    affected_users = models.IntegerField(default=0)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at', 'severity']),
        ]
    
    def __str__(self):
        return f"{self.severity.upper()} - {self.message[:50]}"


class TopConsumer(models.Model):
    """Model for tracking top bandwidth consumers"""
    username = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField()
    bandwidth = models.FloatField()  # in MB
    percentage = models.FloatField()
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    
    class Meta:
        ordering = ['-bandwidth']
    
    def __str__(self):
        return f"{self.username} - {self.bandwidth}MB"
