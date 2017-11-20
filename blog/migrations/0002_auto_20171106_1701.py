# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-06 09:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlogtoTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blogid', models.IntegerField(default=1)),
                ('tagid', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=100)),
                ('fatherid', models.IntegerField(default=1)),
                ('pathStr', models.CharField(default='', max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=100)),
            ],
        ),
        migrations.RemoveField(
            model_name='bloginfo',
            name='category',
        ),
        migrations.AddField(
            model_name='bloginfo',
            name='categoryid',
            field=models.IntegerField(default=1),
        ),
    ]
