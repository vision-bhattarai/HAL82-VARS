from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Campaign
from .serializers import CampaignSerializer, CampaignListSerializer, CampaignCreateUpdateSerializer


class CampaignViewSet(viewsets.ModelViewSet):
    """ViewSet for campaigns"""
    queryset = Campaign.objects.filter(status='active').order_by('-created_at')
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return CampaignListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return CampaignCreateUpdateSerializer
        return CampaignSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Get campaigns based on user type"""
        queryset = Campaign.objects.order_by('-created_at')
        
        # Filter by status if provided
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by startup if provided
        startup_id = self.request.query_params.get('startup_id')
        if startup_id:
            queryset = queryset.filter(startup__id=startup_id)

        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new campaign (startup only)"""
        if not hasattr(request.user, 'startup'):
            return Response({
                'error': 'Only startups can create campaigns'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        campaign = serializer.save()
        
        response_serializer = CampaignSerializer(campaign)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Update campaign (only by startup owner)"""
        campaign = self.get_object()
        
        if campaign.startup.user != request.user:
            return Response({
                'error': 'You do not have permission to update this campaign'
            }, status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete campaign (only by startup owner)"""
        campaign = self.get_object()
        
        if campaign.startup.user != request.user:
            return Response({
                'error': 'You do not have permission to delete this campaign'
            }, status=status.HTTP_403_FORBIDDEN)

        campaign.status = 'cancelled'
        campaign.save()
        
        return Response({
            'message': 'Campaign cancelled successfully'
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending campaigns"""
        campaigns = Campaign.objects.filter(status='active').order_by('-backer_count')[:10]
        serializer = CampaignListSerializer(campaigns, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get campaigns close to completion"""
        campaigns = Campaign.objects.filter(status='active').order_by('-current_amount')[:10]
        serializer = CampaignListSerializer(campaigns, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """Get full campaign details"""
        campaign = self.get_object()
        serializer = CampaignSerializer(campaign)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_campaigns(self, request):
        """Get current startup's campaigns"""
        if not hasattr(request.user, 'startup'):
            return Response({
                'error': 'User is not a startup'
            }, status=status.HTTP_403_FORBIDDEN)

        campaigns = Campaign.objects.filter(startup=request.user.startup)
        serializer = CampaignListSerializer(campaigns, many=True)
        return Response(serializer.data)
