from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Metric, Alert, TopConsumer
from django.utils import timezone
from datetime import timedelta
import json


def dashboard(request):
    """Dashboard view with real-time metrics"""
    # Get latest metrics
    latest_metrics = Metric.objects.filter(
        timestamp__gte=timezone.now() - timedelta(hours=1)
    )
    
    # Calculate stats
    internet_speed = latest_metrics.filter(metric_type='network').order_by('-timestamp').first()
    server_metrics = latest_metrics.filter(metric_type='server').order_by('-timestamp')
    
    # Get top consumers
    top_consumers = TopConsumer.objects.filter(
        timestamp__gte=timezone.now() - timedelta(hours=1)
    )[:5]
    
    # Get recent alerts
    recent_alerts = Alert.objects.filter(is_resolved=False)[:5]
    
    # Chart data (last 24 hours)
    chart_data = Metric.objects.filter(
        metric_type='network',
        timestamp__gte=timezone.now() - timedelta(hours=24)
    ).order_by('timestamp')
    
    chart_labels = [m.timestamp.strftime('%H:%M') for m in chart_data]
    chart_data_in = [m.value for m in chart_data]
    chart_data_out = [m.value * 0.8 for m in chart_data]  # Mock outbound data
    
    context = {
        'internet_speed': internet_speed.value if internet_speed else 0,
        'server_cpu': server_metrics.filter(source='cpu').first().value if server_metrics.filter(source='cpu').exists() else 45,
        'server_ram': server_metrics.filter(source='ram').first().value if server_metrics.filter(source='ram').exists() else 62,
        'active_alerts': Alert.objects.filter(is_resolved=False).count(),
        'top_consumers': top_consumers,
        'recent_alerts': recent_alerts,
        'chart_labels': json.dumps(chart_labels),
        'chart_data_in': json.dumps(chart_data_in),
        'chart_data_out': json.dumps(chart_data_out),
    }
    
    return render(request, 'dashboard.html', context)


def alerts_view(request):
    """Alerts management view"""
    alerts = Alert.objects.all()[:20]
    
    context = {
        'alerts': alerts,
        'critical_count': Alert.objects.filter(severity='critical', is_resolved=False).count(),
        'warning_count': Alert.objects.filter(severity='warning', is_resolved=False).count(),
        'info_count': Alert.objects.filter(severity='info', is_resolved=False).count(),
    }
    
    return render(request, 'alerts.html', context)


def metrics_view(request):
    """Metrics visualization view"""
    metrics = Metric.objects.all()[:50]
    
    # Chart data
    bandwidth_data = Metric.objects.filter(
        metric_type='network',
        timestamp__gte=timezone.now() - timedelta(hours=6)
    ).order_by('timestamp')
    
    server_data = Metric.objects.filter(
        metric_type='server',
        timestamp__gte=timezone.now() - timedelta(hours=6)
    ).order_by('timestamp')
    
    context = {
        'metrics': metrics,
        'avg_bandwidth': 85,
        'max_bandwidth': 120,
        'current_cpu': 45,
        'current_ram': 62,
        'current_disk': 78,
        'bandwidth_labels': json.dumps([m.timestamp.strftime('%H:%M') for m in bandwidth_data]),
        'bandwidth_data': json.dumps([m.value for m in bandwidth_data]),
        'server_labels': json.dumps([m.timestamp.strftime('%H:%M') for m in server_data[:20]]),
        'cpu_data': json.dumps([45, 47, 43, 50, 48]),
        'ram_data': json.dumps([60, 62, 58, 65, 63]),
        'response_labels': json.dumps(['API', 'Database', 'Cache', 'Static']),
        'response_data': json.dumps([120, 85, 25, 15]),
        'connections_data': json.dumps([150, 45, 23]),
    }
    
    return render(request, 'metrics.html', context)


def reports_view(request):
    """Reports generation view"""
    context = {
        'reports_count': 12,
        'last_report_date': timezone.now() - timedelta(days=2),
        'recent_reports': [
            {'title': 'Performance hebdomadaire', 'created_at': timezone.now() - timedelta(days=1), 'size': '2.5 MB'},
            {'title': 'Analyse des anomalies', 'created_at': timezone.now() - timedelta(days=3), 'size': '1.8 MB'},
            {'title': 'Top consommateurs', 'created_at': timezone.now() - timedelta(days=5), 'size': '950 KB'},
        ]
    }
    
    return render(request, 'reports.html', context)
