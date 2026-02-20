from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer, DonationSerializer


class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for wallet management"""
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_wallet(self, request):
        """Get current user's wallet"""
        try:
            wallet = request.user.general_user.wallet
            serializer = WalletSerializer(wallet)
            return Response(serializer.data)
        except Wallet.DoesNotExist:
            return Response({
                'message': 'Wallet not found'
            }, status=status.HTTP_404_NOT_FOUND)


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing transactions"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get transactions for current user"""
        return Transaction.objects.filter(user=self.request.user.general_user)

    @action(detail=False, methods=['get'])
    def my_transactions(self, request):
        """Get current user's transactions"""
        transactions = self.get_queryset()
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class DonationView(generics.CreateAPIView):
    """Endpoint for making donations"""
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        transaction = serializer.save()

        response_data = {
            'message': 'Donation successful',
            'transaction_id': transaction.transaction_id,
            'amount': transaction.amount,
            'campaign': transaction.campaign.product_name,
            'campaign_progress': round(transaction.campaign.get_progress_percentage(), 2)
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
