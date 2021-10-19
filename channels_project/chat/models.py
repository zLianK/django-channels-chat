from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE, DO_NOTHING


class Friend(models.Model):
    STATUS_CHOICES = (
        ('s', 'sended'),
        ('a', 'accepted'),
        ('d', 'declined'),
        ('r', 'removed'),
    )

    current_user = models.ForeignKey(
        User, on_delete=CASCADE, related_name='user_friend')
    user_id = models.ForeignKey(
        User, on_delete=DO_NOTHING, related_name='friend')
    status = models.CharField(max_length=1, choices=STATUS_CHOICES)


class ChatGroup(models.Model):
    STATUS_CHOICES = (
        ('e', 'enabled'),
        ('d', 'disabled'),
    )

    user_1 = models.ForeignKey(
        User, on_delete=DO_NOTHING, related_name='user_1')
    status_user_1 = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default='d')
    last_change_1 = models.DateTimeField(blank=True, null=True)
    user_2 = models.ForeignKey(
        User, on_delete=DO_NOTHING, related_name='user_2')
    status_user_2 = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default='d')
    last_change_2 = models.DateTimeField(blank=True, null=True)
    last_change = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    sender = models.ForeignKey(
        User, on_delete=DO_NOTHING, related_name='sender')
    recipient = models.ForeignKey(
        User, on_delete=DO_NOTHING, related_name='recipient')
    content = models.CharField(max_length=1000)
    datetime = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField()


class Favorite(models.Model):
    current_user = models.ForeignKey(
        User, on_delete=CASCADE, related_name='user_favorite')
    user_id = models.ForeignKey(
        User, on_delete=DO_NOTHING, related_name='favorited')


class Archive(models.Model):
    current_user = models.ForeignKey(
        User, on_delete=CASCADE, related_name='user_archive')
    user_id = models.ForeignKey(
        User, on_delete=DO_NOTHING, related_name='achieved')


class Like(models.Model):
    message_id = models.ForeignKey(Message, on_delete=DO_NOTHING)
    current_user = models.ForeignKey(User, on_delete=DO_NOTHING)
