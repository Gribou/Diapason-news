# Generated by Django 3.2.9 on 2021-11-11 07:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eNews', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='doc',
            name='search_index',
            field=models.TextField(blank=True, null=True),
        ),
    ]