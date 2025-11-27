from django.db import migrations, models
from django.db.models import F

def copy_year_to_new_field(apps, schema_editor):
    HeritageSite = apps.get_model('heritage', 'HeritageSite')
    for site in HeritageSite.objects.all():
        if site.established:
            site.established_year = site.established.year
            site.save(update_fields=['established_year'])

class Migration(migrations.Migration):

    dependencies = [
        ('heritage', '0001_initial'),
    ]

    operations = [
        # Add new field
        migrations.AddField(
            model_name='heritagesite',
            name='established_year',
            field=models.PositiveSmallIntegerField(null=True, blank=True),
        ),
        # Run data copy function
        migrations.RunPython(copy_year_to_new_field),
        # Remove old date field
        migrations.RemoveField(
            model_name='heritagesite',
            name='established',
        ),
        # Rename new field to 'established'
        migrations.RenameField(
            model_name='heritagesite',
            old_name='established_year',
            new_name='established',
        ),
    ]
