from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MarketplaceCategoryViewSet,
    MarketplaceProductViewSet,
    MarketplaceSellerViewSet,
    MarketplaceOrderViewSet,
    MarketplaceProductInquiryCreateView,
    MarketplaceProductImageCreateView,
    MarketplaceBrowseProductsView
)

router = DefaultRouter()
router.register(r'categories', MarketplaceCategoryViewSet, basename='categories')
router.register(r'products', MarketplaceProductViewSet, basename='products')
router.register(r'sellers', MarketplaceSellerViewSet, basename='sellers')
router.register(r'orders', MarketplaceOrderViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),
    path('browse/', MarketplaceBrowseProductsView.as_view(), name='marketplace-browse'),
    path('inquiry/', MarketplaceProductInquiryCreateView.as_view(), name='marketplace-product-inquiry'),
    path('product-images/add/', MarketplaceProductImageCreateView.as_view(), name='marketplace-product-image-add'),
]
