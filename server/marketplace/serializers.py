from rest_framework import serializers
from django.contrib.auth.models import User
from heritage.models import HeritageSite
from .models import (
    MarketplaceCategory,
    MarketplaceProduct,
    MarketplaceProductImage,
    MarketplaceSeller,
    MarketplaceOrder,
    MarketplaceOrderItem,
    MarketplaceProductInquiry,
)

# --------- CATEGORY SERIALIZER ---------
class MarketplaceCategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = MarketplaceCategory
        fields = [
            'id', 'name', 'slug', 'parent', 'description', 'is_active', 'sort_order', 'subcategories'
        ]

    def get_subcategories(self, obj):
        # Only for top-level use, avoid infinite recursion
        return [
            {'id': sub.id, 'name': sub.name}
            for sub in obj.subcategories.filter(is_active=True)
        ]

# --------- PRODUCT IMAGE SERIALIZER ---------
class MarketplaceProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketplaceProductImage
        fields = ['id', 'image', 'alt_text', 'sort_order']

# --------- SELLER SERIALIZER ---------
class MarketplaceSellerSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = MarketplaceSeller
        fields = [
            'id', 'user', 'user_username', 'display_name',
            'bio', 'verified', 'phone', 'address', 'payment_info'
        ]

# --------- PRODUCT SERIALIZER ---------
class MarketplaceProductSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=MarketplaceCategory.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
        source='category'
    )
    images = serializers.SerializerMethodField(read_only=True)
    main_image = serializers.ImageField(required=False, allow_null=True)
    digital_file = serializers.FileField(required=False, allow_null=True)
    seller = serializers.SerializerMethodField(read_only=True)
    seller_id = serializers.PrimaryKeyRelatedField(
        queryset=MarketplaceSeller.objects.all(),  # fixed wrong queryset
        write_only=True,
        required=False,
        allow_null=True,
        source='seller'
    )
    site = serializers.PrimaryKeyRelatedField(
        queryset=HeritageSite.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = MarketplaceProduct
        fields = [
            'id', 'name', 'category', 'category_id', 'images', 'main_image',
            'digital_file', 'seller', 'seller_id', 'site', 'price', 'inventory',
            'available', 'created_at', 'updated_at', 'product_type',
            'short_description', 'description', 'sku', 'video_url',
            'featured', 'is_active'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ensure seller_id queryset is properly set (lazy import can stay)
        from .models import MarketplaceSeller  
        self.fields['seller_id'].queryset = MarketplaceSeller.objects.all()

    def get_category(self, obj):
        if obj.category:
            return {'id': obj.category.id, 'name': obj.category.name}
        return None

    def get_images(self, obj):
        # Use the related_name 'product_images' as in your model
        images = obj.product_images.all()
        return [{'id': img.id, 'image': img.image.url, 'alt_text': img.alt_text} for img in images]

    def get_seller(self, obj):
        seller = getattr(obj, 'seller', None)
        if seller:
            # seller is User FK; try to get MarketplaceSeller for display
            marketplace_seller = getattr(seller, 'marketplace_seller', None)
            if marketplace_seller:
                return {'id': marketplace_seller.id, 'display_name': marketplace_seller.display_name}
            # fallback username
            return {'id': seller.id, 'display_name': getattr(seller, 'username', '')}
        return None


# --------- ORDER ITEM SERIALIZER ---------
class MarketplaceOrderItemSerializer(serializers.ModelSerializer):
    product = MarketplaceProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=MarketplaceProduct.objects.all(),
        write_only=True, source='product'
    )

    class Meta:
        model = MarketplaceOrderItem
        fields = [
            'id', 'order', 'product', 'product_id', 'name', 'quantity', 'price_at_purchase'
        ]
        read_only_fields = ['id', 'order', 'product', 'name', 'price_at_purchase']

# --------- ORDER SERIALIZER ---------
class MarketplaceOrderSerializer(serializers.ModelSerializer):
    items = MarketplaceOrderItemSerializer(many=True, read_only=True)
    buyer_username = serializers.ReadOnlyField(source='buyer.username')

    class Meta:
        model = MarketplaceOrder
        fields = [
            'id', 'buyer', 'buyer_username', 'buyer_name', 'buyer_email',
            'address', 'status', 'shipping_provider', 'tracking_number',
            'shipped_at', 'paid_at', 'created_at', 'items'
        ]
        read_only_fields = [
            'id', 'created_at', 'shipped_at', 'paid_at', 'status', 'items', 'buyer_username'
        ]

# --------- PRODUCT INQUIRY SERIALIZER ---------
class MarketplaceProductInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketplaceProductInquiry
        fields = [
            'id', 'product', 'name', 'email', 'message', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    # product_id = serializers.PrimaryKeyRelatedField(
    #     queryset=MarketplaceProduct.objects.all(),
    #     write_only=True,
    #     source='product'
    # )