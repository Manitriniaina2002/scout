from django.contrib import admin
from .models import Metric, Alert, TopConsumer


@admin.register(Metric)
class MetricAdmin(admin.ModelAdmin):
    list_display = ('metric_type', 'value', 'unit', 'timestamp', 'is_anomaly', 'source')
    list_filter = ('metric_type', 'is_anomaly', 'timestamp')
    search_fields = ('source',)
    date_hierarchy = 'timestamp'


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('severity', 'metric_type', 'message', 'value', 'threshold', 'is_resolved', 'created_at')
    list_filter = ('severity', 'metric_type', 'is_resolved', 'created_at')
    search_fields = ('message', 'ai_analysis')
    date_hierarchy = 'created_at'
    actions = ['mark_as_resolved']
    
    def mark_as_resolved(self, request, queryset):
        from django.utils import timezone
        queryset.update(is_resolved=True, resolved_at=timezone.now())
    mark_as_resolved.short_description = "Mark selected alerts as resolved"


@admin.register(TopConsumer)
class TopConsumerAdmin(admin.ModelAdmin):
    list_display = ('username', 'ip_address', 'bandwidth', 'percentage', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('username', 'ip_address')
    date_hierarchy = 'timestamp'
