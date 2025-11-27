from django.db import models

class HeritageTag(models.Model):
    name = models.CharField(max_length=40, unique=True)
    def __str__(self):
        return self.name

class HeritageSite(models.Model):
    SITE_TYPES = [
        ('NATURAL HERITAGE', 'Natural Heritage'),
        ('ARCHEAOLOGICAL SITE', 'Archaeological Site'),
        ('TEMPLE', 'Temple'),
        ('MONUMENT', 'Monument'),
        ('FORT', 'Fort'),
        ('PALACE', 'Palace'),
    ]
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    description = models.TextField()  # Short description
    detailed_description = models.TextField(blank=True)   # Add this field
    state = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    established_year = models.PositiveSmallIntegerField(blank=True, null=True, help_text="Year of establishment")
    site_type = models.CharField(max_length=30, choices=SITE_TYPES)
    tags = models.ManyToManyField(HeritageTag, blank=True, related_name="heritage_sites")
    architect = models.CharField(max_length=100, blank=True)
    style = models.CharField(max_length=100, blank=True)
    built = models.CharField(max_length=50, blank=True, help_text="e.g. 1631-1653")

    conservation_structural_integrity = models.PositiveIntegerField(blank=True, null=True, help_text="Percent 0-100")
    conservation_preservation_quality = models.PositiveIntegerField(blank=True, null=True, help_text="Percent 0-100")
    image = models.ImageField(upload_to='heritage_images/', blank=True, null=True)
    rating = models.FloatField(default=0)
    is_active = models.BooleanField(default=True)

    # Visitor Info
    visitor_timings = models.CharField(max_length=100, blank=True)
    visitor_fee = models.CharField(max_length=100, blank=True)
    visitor_best_time = models.CharField(max_length=100, blank=True)
    visitor_duration = models.CharField(max_length=50, blank=True)

    # Timeline (optional, simplified, suggested as JSON/Text for now)
    timeline = models.JSONField(blank=True, null=True)  # Example: [{"year": 1631, "event": "Construction begins"}]

    def __str__(self):
        return self.name


class HeritageEvent(models.Model):
    id = models.AutoField(primary_key=True)
    site = models.ForeignKey(HeritageSite, related_name='events', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    date = models.DateTimeField()
    details = models.TextField()
    def __str__(self):
        return f'{self.site.name} - {self.title} ({self.date})'

class HeritageResource(models.Model):
    site = models.ForeignKey(HeritageSite, related_name='resources', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='heritage_resources/')
    filetype = models.CharField(max_length=10, choices=[('PDF', 'PDF'), ('ZIP', 'ZIP')], default='PDF')
    size_mb = models.DecimalField(max_digits=8, decimal_places=2)
    access = models.CharField(max_length=20, default='Public')  # e.g., "Public", "Researcher"
