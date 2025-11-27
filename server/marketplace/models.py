from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class MarketplaceCategory(models.Model):
    name = models.CharField(max_length=64)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='subcategories', on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    slug = models.SlugField(max_length=80, unique=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name

class MarketplaceProduct(models.Model):
    PHYSICAL = 'physical'
    DIGITAL = 'digital'
    PRODUCT_TYPE_CHOICES = [
        (PHYSICAL, 'Physical'),
        (DIGITAL, 'Digital'),
    ]

    name = models.CharField(max_length=255)
    short_description = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    sku = models.CharField(max_length=40, unique=True, blank=True, null=True)
    images = models.ManyToManyField('MarketplaceProductImage', blank=True)
    main_image = models.ImageField(upload_to='marketplace/products/', blank=True, null=True)
    digital_file = models.FileField(upload_to='marketplace/digital_goods/', blank=True, null=True)
    product_type = models.CharField(max_length=10, choices=PRODUCT_TYPE_CHOICES, default=PHYSICAL)
    video_url = models.URLField(blank=True, null=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    inventory = models.IntegerField(default=1)
    available = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    category = models.ForeignKey(MarketplaceCategory, on_delete=models.SET_NULL, null=True, blank=True)
    site = models.ForeignKey('heritage.HeritageSite', on_delete=models.SET_NULL, null=True, blank=True, related_name='market_products')
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
    
class MarketplaceProductImage(models.Model):
    product = models.ForeignKey(MarketplaceProduct, on_delete=models.CASCADE, related_name='product_images')
    image = models.ImageField(upload_to='marketplace/products/gallery/')
    alt_text = models.CharField(max_length=255, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order']

class MarketplaceSeller(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='marketplace_seller')
    display_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    verified = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    payment_info = models.TextField(blank=True)  # For stripe/paypal details

    def __str__(self):
        return self.display_name or self.user.username

class MarketplaceOrder(models.Model):
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='marketplace_orders')
    buyer_name = models.CharField(max_length=128, blank=True)  # for guest checkout
    buyer_email = models.EmailField(blank=True)
    address = models.TextField(blank=True)    # For physical goods
    status = models.CharField(max_length=24, choices=[
        ("PENDING", "Pending"), 
        ("PAID", "Paid"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled")
    ], default="PENDING")
    shipping_provider = models.CharField(max_length=64, blank=True)
    tracking_number = models.CharField(max_length=64, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} by {self.buyer_email or self.buyer}"

class MarketplaceOrderItem(models.Model):
    order = models.ForeignKey(MarketplaceOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(MarketplaceProduct, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

class MarketplaceProductInquiry(models.Model):
    product = models.ForeignKey(MarketplaceProduct, on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
