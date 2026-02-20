from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import GeneralUser, Startup
from .serializers import (
    UserSerializer, GeneralUserSerializer, StartupSerializer,
    StartupDetailSerializer, UserRegistrationSerializer, StartupRegistrationSerializer
)
from wallet.models import Wallet


class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create wallet for new user
        general_user = user.general_user
        Wallet.objects.create(user=general_user, balance=0.00)

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    """User login endpoint"""
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            general_user = GeneralUser.objects.get(user=user)
            serializer = GeneralUserSerializer(general_user)
            return Response({
                'message': 'Login successful',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutView(generics.GenericAPIView):
    """User logout endpoint"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)


class CurrentUserView(generics.GenericAPIView):
    """Get current authenticated user info"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            general_user = user.general_user
            serializer = GeneralUserSerializer(general_user)
            return Response(serializer.data)
        except GeneralUser.DoesNotExist:
            return Response({
                'message': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class GeneralUserViewSet(viewsets.ModelViewSet):
    """ViewSet for general users"""
    queryset = GeneralUser.objects.all()
    serializer_class = GeneralUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.action == 'list':
            return GeneralUser.objects.none()
        return super().get_queryset()

    def retrieve(self, request, *args, **kwargs):
        """Allow users to retrieve their own profile"""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().retrieve(request, *args, **kwargs)


class StartupRegistrationView(generics.CreateAPIView):
    """Convert general user to startup"""
    serializer_class = StartupRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        startup = serializer.save()
        response_serializer = StartupDetailSerializer(startup)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class StartupViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing startups"""
    queryset = Startup.objects.filter(is_verified=True)
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StartupDetailSerializer
        return StartupSerializer

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_startup(self, request):
        """Get current user's startup if exists"""
        try:
            startup = request.user.startup
            serializer = StartupDetailSerializer(startup)
            return Response(serializer.data)
        except Startup.DoesNotExist:
            return Response({
                'message': 'User does not have a startup'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get startup statistics"""
        total_startups = Startup.objects.filter(is_verified=True).count()
        total_funded = Startup.objects.filter(is_verified=True).aggregate(
            total=models.Sum('total_raised')
        )['total'] or 0
        
        return Response({
            'total_startups': total_startups,
            'total_funded': total_funded
        })


from django.db import models
