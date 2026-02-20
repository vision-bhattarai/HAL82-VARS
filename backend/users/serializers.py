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
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    citizenship_number = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, value):
        if not value:
            raise serializers.ValidationError("Username cannot be empty")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken. Please choose another.")
        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email cannot be empty")
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered. Please use a different email.")
        return value

    def validate_citizenship_number(self, value):
        if value and value.strip():  # Only validate if provided
            if GeneralUser.objects.filter(citizenship_number=value).exists():
                raise serializers.ValidationError("This citizenship number is already registered.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")
        return value

    def create(self, validated_data):
        try:
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
        except Exception as e:
            raise serializers.ValidationError(f"Error creating user: {str(e)}")


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
