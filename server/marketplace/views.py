from rest_framework import viewsets, generics, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import (
    MarketplaceCategory, 
    MarketplaceProduct, 
    MarketplaceProductImage, 
    MarketplaceSeller,
    MarketplaceOrder, 
    MarketplaceOrderItem, 
    MarketplaceProductInquiry,
)
from .serializers import (
    MarketplaceCategorySerializer, 
    MarketplaceProductSerializer, 
    MarketplaceProductImageSerializer,
    MarketplaceSellerSerializer,
    MarketplaceOrderSerializer, 
    MarketplaceOrderItemSerializer,
    MarketplaceProductInquirySerializer,
)

# --------- CATEGORY VIEWS ---------
class MarketplaceCategoryViewSet(viewsets.ModelViewSet):
    queryset = MarketplaceCategory.objects.filter(is_active=True)
    serializer_class = MarketplaceCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ["sort_order", "name"]
    search_fields = ["name", "description"]

# --------- SELLER PROFILE VIEW ---------
class MarketplaceSellerViewSet(viewsets.ModelViewSet):
    queryset = MarketplaceSeller.objects.all()
    serializer_class = MarketplaceSellerSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    # Owner can only update their profile
    def get_object(self):
        if self.action in ['update', 'partial_update', 'destroy'] and self.request.user.is_authenticated:
            return get_object_or_404(MarketplaceSeller, user=self.request.user)
        return super().get_object()

class IsArtisan(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', '') == 'ARTISAN'


# --------- PRODUCT VIEWS ---------
class MarketplaceProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsArtisan]
    queryset = MarketplaceProduct.objects.filter(is_active=True, available=True)
    serializer_class = MarketplaceProductSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ["price", "created_at", "name"]
    search_fields = ["name", "description", "short_description"]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Will link to authenticated user's seller profile if available
        seller = getattr(self.request.user, 'marketplace_seller', None)
        serializer.save(seller=seller or None)

    # Optionally, admin/owner only access for update/delete

    @action(detail=False, permission_classes=[permissions.IsAuthenticated])
    def my_products(self, request):
        seller = getattr(request.user, 'marketplace_seller', None)
        if not seller:
            return Response([], status=status.HTTP_200_OK)
        products = self.get_queryset().filter(seller=seller)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

# --------- MULTIPLE PRODUCT IMAGES CRUD ---------
class MarketplaceProductImageCreateView(generics.CreateAPIView):
    serializer_class = MarketplaceProductImageSerializer
    permission_classes = [permissions.IsAuthenticated]

# --------- ORDER VIEWS ---------
class MarketplaceOrderViewSet(viewsets.ModelViewSet):
    serializer_class = MarketplaceOrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and not user.is_staff:
            return MarketplaceOrder.objects.filter(Q(buyer=user) | Q(buyer_email=user.email)).order_by("-created_at")
        # Admin/staff can see all
        return MarketplaceOrder.objects.all().order_by("-created_at")

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]  # Buyer could be guest
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # For guest checkout, don't require a user
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(buyer=user)

# --------- ORDER ITEM LIST/CREATE (RARELY USED DIRECTLY IN MVP) ---------
class MarketplaceOrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = MarketplaceOrderItemSerializer
    queryset = MarketplaceOrderItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]

# --------- PRODUCT INQUIRY FORM ---------
class MarketplaceProductInquiryCreateView(generics.CreateAPIView):
    serializer_class = MarketplaceProductInquirySerializer
    permission_classes = [permissions.AllowAny]

# --------- PUBLIC SEARCH/BROWSE SHORTCUT ---------
class MarketplaceBrowseProductsView(generics.ListAPIView):
    serializer_class = MarketplaceProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ["price", "created_at"]
    search_fields = ["name", "description"]

    def get_queryset(self):
        queryset = MarketplaceProduct.objects.filter(is_active=True, available=True)
        site = self.request.query_params.get('site')
        if site:
            queryset = queryset.filter(site_id=site)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        return queryset

# --------- CATEGORY VIEWS ---------
class MarketplaceCategoryViewSet(viewsets.ModelViewSet):
    queryset = MarketplaceCategory.objects.filter(is_active=True)
    serializer_class = MarketplaceCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ["sort_order", "name"]
    search_fields = ["name", "description"]

# --------- SELLER PROFILE VIEW ---------
class MarketplaceSellerViewSet(viewsets.ModelViewSet):
    queryset = MarketplaceSeller.objects.all()
    serializer_class = MarketplaceSellerSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    # Owner can only update their profile
    def get_object(self):
        if self.action in ['update', 'partial_update', 'destroy'] and self.request.user.is_authenticated:
            return get_object_or_404(MarketplaceSeller, user=self.request.user)
        return super().get_object()

# --------- PRODUCT VIEWS ---------
class MarketplaceProductViewSet(viewsets.ModelViewSet):
    queryset = MarketplaceProduct.objects.filter(is_active=True, available=True)
    serializer_class = MarketplaceProductSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ["price", "created_at", "name"]
    search_fields = ["name", "description", "short_description"]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Will link to authenticated user's seller profile if available
        seller = getattr(self.request.user, 'marketplace_seller', None)
        serializer.save(seller=self.request.user)

    # Optionally, admin/owner only access for update/delete

    @action(detail=False, permission_classes=[permissions.IsAuthenticated])
    def my_products(self, request):
        seller = getattr(request.user, 'marketplace_seller', None)
        if not seller:
            return Response([], status=status.HTTP_200_OK)
        products = self.get_queryset().filter(seller=seller)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

# --------- MULTIPLE PRODUCT IMAGES CRUD ---------
class MarketplaceProductImageCreateView(generics.CreateAPIView):
    serializer_class = MarketplaceProductImageSerializer
    permission_classes = [permissions.IsAuthenticated]

# --------- ORDER VIEWS ---------
class MarketplaceOrderViewSet(viewsets.ModelViewSet):
    serializer_class = MarketplaceOrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and not user.is_staff:
            return MarketplaceOrder.objects.filter(Q(buyer=user) | Q(buyer_email=user.email)).order_by("-created_at")
        # Admin/staff can see all
        return MarketplaceOrder.objects.all().order_by("-created_at")

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]  # Buyer could be guest
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # For guest checkout, don't require a user
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(buyer=user)

# --------- ORDER ITEM LIST/CREATE (RARELY USED DIRECTLY IN MVP) ---------
class MarketplaceOrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = MarketplaceOrderItemSerializer
    queryset = MarketplaceOrderItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]

# --------- PRODUCT INQUIRY FORM ---------
class MarketplaceProductInquiryCreateView(generics.CreateAPIView):
    serializer_class = MarketplaceProductInquirySerializer
    permission_classes = [permissions.AllowAny]

# --------- PUBLIC SEARCH/BROWSE SHORTCUT ---------
class MarketplaceBrowseProductsView(generics.ListAPIView):
    serializer_class = MarketplaceProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ["price", "created_at"]
    search_fields = ["name", "description"]

    def get_queryset(self):
        queryset = MarketplaceProduct.objects.filter(is_active=True, available=True)
        site = self.request.query_params.get('site')
        if site:
            queryset = queryset.filter(site_id=site)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        return queryset

