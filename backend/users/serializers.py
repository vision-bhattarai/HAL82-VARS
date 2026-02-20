from rest_framework import serializers
from django.contrib.auth.models import User
from .models import GeneralUser, Startup


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class GeneralUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = GeneralUser
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_donated']


class StartupSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    general_user = GeneralUserSerializer()

    class Meta:
        model = Startup
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_raised']


class StartupDetailSerializer(serializers.ModelSerializer):
    """Detailed startup serializer with related campaigns"""
    user = UserSerializer()
    campaigns_count = serializers.SerializerMethodField()

    class Meta:
        model = Startup
        fields = ['id', 'user', 'company_name', 'category', 'description', 'logo', 'website',
                  'total_requested', 'total_raised', 'is_verified', 'created_at', 'campaigns_count']

    def get_campaigns_count(self, obj):
        return obj.campaigns.filter(status='active').count()


class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    citizenship_number = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        general_user = GeneralUser.objects.create(
            user=user,
            phone_number=validated_data.get('phone_number', ''),
            citizenship_number=validated_data.get('citizenship_number', '')
        )
        
        return user


class StartupRegistrationSerializer(serializers.Serializer):
    company_name = serializers.CharField(max_length=255)
    category = serializers.ChoiceField(choices=Startup._meta.get_field('category').choices)
    description = serializers.CharField()
    website = serializers.URLField(required=False)

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated")

        try:
            general_user = request.user.general_user
        except GeneralUser.DoesNotExist:
            raise serializers.ValidationError("User must have a general user profile first")

        startup = Startup.objects.create(
            user=request.user,
            general_user=general_user,
            company_name=validated_data['company_name'],
            category=validated_data['category'],
            description=validated_data['description'],
            website=validated_data.get('website', ''),
            total_requested=0
        )

        return startup
