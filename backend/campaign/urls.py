from django.urls import path
from .views import CampaignViewSet

# Manual URL routing without routers to avoid format_suffix_patterns issue
list_view = CampaignViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

detail_view = CampaignViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

trending_view = CampaignViewSet.as_view({'get': 'trending'})
popular_view = CampaignViewSet.as_view({'get': 'popular'})
my_campaigns_view = CampaignViewSet.as_view({'get': 'my_campaigns'})
details_view = CampaignViewSet.as_view({'get': 'details'})

urlpatterns = [
    path('', list_view, name='campaign-list'),
    path('<int:pk>/', detail_view, name='campaign-detail'),
    path('trending/', trending_view, name='campaign-trending'),
    path('popular/', popular_view, name='campaign-popular'),
    path('my_campaigns/', my_campaigns_view, name='campaign-my-campaigns'),
    path('<int:pk>/details/', details_view, name='campaign-details'),
]
