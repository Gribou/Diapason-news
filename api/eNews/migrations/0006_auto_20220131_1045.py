# Generated by Django 3.2.11 on 2022-01-31 09:45

from django.db import migrations, models
import eNews.models


class Migration(migrations.Migration):

    dependencies = [
        ('eNews', '0005_auto_20220130_1824'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='doc',
            options={'ordering': ['-publication_date', 'reference'], 'verbose_name': 'doc', 'verbose_name_plural': 'docs'},
        ),
        migrations.AddField(
            model_name='doc',
            name='reference',
            field=models.CharField(max_length=25, null=True, verbose_name='Référence'),
        ),
        migrations.AlterField(
            model_name='doc',
            name='year_ref',
            field=models.PositiveIntegerField(default=eNews.models.current_year, verbose_name='Année de rédaction du document'),
        ),
    ]
