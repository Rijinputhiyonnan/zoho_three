# Generated by Django 5.0 on 2024-01-18 05:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zohoapp', '0010_remove_invoiceattach_loan_invoiceattach_invoice'),
    ]

    operations = [
        migrations.AddField(
            model_name='additem',
            name='available_stock',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]