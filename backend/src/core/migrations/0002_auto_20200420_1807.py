# Generated by Django 3.0.5 on 2020-04-20 18:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='category',
            field=models.CharField(choices=[('S', 'Shirt'), ('SW', 'Sport wear'), ('B', 'Breakfast'), ('L', 'Lunch'), ('D', 'Dinner'), ('FP', 'Fresh Produce'), ('BK', 'Bakery')], max_length=2),
        ),
    ]
