# Generated by Django 3.0.3 on 2020-02-21 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('director', '0006_auto_20200221_0127'),
    ]

    operations = [
        migrations.RenameField(
            model_name='party',
            old_name='party_code',
            new_name='host_code',
        ),
        migrations.AddField(
            model_name='party',
            name='name',
            field=models.CharField(default='Party', max_length=25),
        ),
    ]
