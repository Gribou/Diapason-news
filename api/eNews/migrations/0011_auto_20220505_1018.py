# Generated by Django 3.2.11 on 2022-05-05 08:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('eNews', '0010_auto_20220316_1458'),
    ]

    operations = [
        migrations.CreateModel(
            name='Theme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(default='', max_length=100, null=True, verbose_name='Nom complet')),
                ('short_name', models.CharField(default='', max_length=15, null=True, unique=True, verbose_name='Abréviation')),
            ],
            options={
                'verbose_name': 'Thème',
                'verbose_name_plural': 'Thèmes',
                'ordering': ['short_name'],
            },
        ),
        migrations.AddField(
            model_name='doc',
            name='theme',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='docs', to='eNews.theme'),
        ),
    ]