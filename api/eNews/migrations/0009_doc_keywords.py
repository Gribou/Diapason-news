# Generated by Django 3.2.12 on 2022-03-16 13:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eNews', '0008_alter_doc_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='doc',
            name='keywords',
            field=models.CharField(blank=True, help_text='Sont indexés par le moteur de recherche', max_length=250, null=True, verbose_name='Mots-clés'),
        ),
    ]
