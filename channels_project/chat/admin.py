from django.contrib import admin
from .models import Friend, Message, Favorite, Archive, Like, ChatGroup


class FriendAdmin(admin.ModelAdmin):
    list_display = ['id', 'current_user', 'user_id', 'status']
    list_editable = ['status']


class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'recipient',
                    'content', 'datetime', 'status']
    list_editable = ['content', 'status']


class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['id', 'current_user', 'user_id']


class ArchiveAdmin(admin.ModelAdmin):
    list_display = ['id', 'current_user', 'user_id']


class LikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'message_id', 'current_user']


class ChatGroupAdmin(admin.ModelAdmin):
    list_display = ['id']


admin.site.register(Friend, FriendAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(Favorite, FavoriteAdmin)
admin.site.register(Archive, ArchiveAdmin)
admin.site.register(Like, LikeAdmin)
admin.site.register(ChatGroup, ChatGroupAdmin)
