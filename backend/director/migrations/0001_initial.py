# Generated by Django 3.0.3 on 2020-03-04 07:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Song',
            fields=[
                ('song_id', models.CharField(max_length=25, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('artist', models.CharField(max_length=50)),
                ('album', models.CharField(max_length=50)),
                ('album_art', models.URLField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('join_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='SongRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('request_time', models.DateTimeField(auto_now_add=True)),
                ('requester_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='songs_requested', to='director.User')),
                ('skip_requests', models.ManyToManyField(blank=True, related_name='song_skips_requested', to='director.User')),
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
                ('guests', models.ManyToManyField(related_name='guests', to='director.User')),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='host', to='director.User')),
                ('queue', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='director.PartyQueue')),
            ],
        ),
    ]
