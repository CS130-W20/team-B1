# Generated by Django 3.0.3 on 2020-03-08 21:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('join_time', models.DateTimeField(auto_now_add=True)),
                ('spotify_id', models.TextField(null=True, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Song',
            fields=[
                ('uri', models.TextField(primary_key=True, serialize=False)),
                ('name', models.TextField()),
                ('artist', models.TextField()),
                ('album_art', models.URLField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('key', models.TextField(primary_key=True, serialize=False, verbose_name='Key')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='spotify_token', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'verbose_name': 'Token',
                'verbose_name_plural': 'Tokens',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SongRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('request_time', models.DateTimeField(auto_now_add=True)),
                ('requester_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='songs_requested', to=settings.AUTH_USER_MODEL)),
                ('skip_requests', models.ManyToManyField(blank=True, related_name='song_skips_requested', to=settings.AUTH_USER_MODEL)),
                ('song', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='director.Song')),
            ],
        ),
        migrations.CreateModel(
            name='PartyQueue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('history', models.ManyToManyField(related_name='history', to='director.SongRequest')),
                ('queue', models.ManyToManyField(related_name='queue', to='director.SongRequest')),
                ('skipped', models.ManyToManyField(related_name='skipped', to='director.SongRequest')),
            ],
        ),
        migrations.CreateModel(
            name='Party',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('host_code', models.CharField(max_length=4, unique=True)),
                ('name', models.CharField(default='Party', max_length=25)),
                ('skipPercentageThreshold', models.FloatField(default=0.25)),
                ('guests', models.ManyToManyField(related_name='guests', to=settings.AUTH_USER_MODEL)),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='host', to=settings.AUTH_USER_MODEL)),
                ('queue', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='director.PartyQueue')),
            ],
        ),
    ]
