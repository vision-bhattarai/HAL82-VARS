from rest_framework import serializers
from .models import Wallet, Transaction
import uuid


class WalletSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.user.username', read_only=True)

    class Meta:
        model = Wallet
        fields = ['id', 'user', 'user_username', 'balance', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.user.username', read_only=True)
    campaign_name = serializers.CharField(source='campaign.product_name', read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'transaction_id']

    def create(self, validated_data):
        # Generate unique transaction ID
        validated_data['transaction_id'] = str(uuid.uuid4())
        return super().create(validated_data)


class DonationSerializer(serializers.Serializer):
    campaign_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    def create(self, validated_data):
        from campaign.models import Campaign
        request = self.context.get('request')
        
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated")

        try:
            general_user = request.user.general_user
        except:
            raise serializers.ValidationError("User must have a general user profile")

        try:
            campaign = Campaign.objects.get(id=validated_data['campaign_id'])
        except Campaign.DoesNotExist:
            raise serializers.ValidationError("Campaign not found")

        amount = validated_data['amount']

        if campaign.status != 'active':
            raise serializers.ValidationError("Campaign is not active")

        # Create transaction
        transaction = Transaction.objects.create(
            user=general_user,
            campaign=campaign,
            amount=amount,
            transaction_type='donation',
            status='completed',
            transaction_id=str(uuid.uuid4()),
            description=f"Donation to {campaign.product_name}"
        )

        # Update campaign amount and backer count
        campaign.current_amount += amount
        campaign.backer_count += 1
        campaign.save()

        # Update user total donated
        general_user.total_donated += amount
        general_user.save()

        # Update startup total raised
        campaign.startup.total_raised += amount
        campaign.startup.save()

        return transaction
