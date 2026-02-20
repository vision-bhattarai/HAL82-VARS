from rest_framework import serializers
from .models import Campaign
from users.serializers import StartupSerializer


class CampaignSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    startup_name = serializers.CharField(source='startup.company_name', read_only=True)
    startup = StartupSerializer(read_only=True)

    class Meta:
        model = Campaign
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'current_amount', 'backer_count', 'progress_percentage']

    def get_progress_percentage(self, obj):
        return round(obj.get_progress_percentage(), 2)


class CampaignListSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    startup_name = serializers.CharField(source='startup.company_name', read_only=True)

    class Meta:
        model = Campaign
        fields = ['id', 'product_name', 'product_type', 'description', 'goal_amount', 
                 'current_amount', 'early_access_price', 'image', 'status', 'backer_count',
                 'created_at', 'startup_name', 'progress_percentage']

    def get_progress_percentage(self, obj):
        return round(obj.get_progress_percentage(), 2)


class CampaignCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ['product_name', 'product_type', 'description', 'detailed_description',
                 'goal_amount', 'early_access_price', 'estimated_delivery', 'image', 'end_date']

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated")

        try:
            startup = request.user.startup
        except:
            raise serializers.ValidationError("User must be a startup to create campaigns")

        campaign = Campaign.objects.create(
            startup=startup,
            **validated_data
        )
        return campaign
