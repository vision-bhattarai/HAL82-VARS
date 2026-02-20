from django.urls import path
from .views import WalletViewSet, TransactionViewSet, DonationView

# Manual URL routing to avoid format_suffix_patterns issue
wallet_view = WalletViewSet.as_view({'get': 'my_wallet'})
transaction_list_view = TransactionViewSet.as_view({'get': 'list'})
transaction_my_view = TransactionViewSet.as_view({'get': 'my_transactions'})

urlpatterns = [
    path('donate/', DonationView.as_view(), name='donate'),
    path('wallets/my_wallet/', wallet_view, name='wallet-my-wallet'),
    path('transactions/', transaction_list_view, name='transaction-list'),
    path('transactions/my_transactions/', transaction_my_view, name='transaction-my-transactions'),
]
