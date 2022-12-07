# Generated by Django 3.2.12 on 2022-03-16 13:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('eNews', '0009_doc_keywords'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doc',
            name='approbateur',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Doc_approbateur', to=settings.AUTH_USER_MODEL, verbose_name='Approbateur'),
        ),
        migrations.AlterField(
            model_name='doc',
            name='redacteur',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Doc_redacteur', to=settings.AUTH_USER_MODEL, verbose_name='Rédacteur'),
        ),
    ]