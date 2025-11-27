from rest_framework import serializers
from .models import Post, Comment, Vote, CommentVote, UserBadge
from heritage.models import HeritageSite

class HeritageSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeritageSite
        fields = ['id', 'name', 'state', 'city', 'latitude', 'longitude', 'established_year', 'site_type', 'image', 'rating', 'is_active', 'description']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    site = HeritageSiteSerializer(read_only=True)
    site_id = serializers.PrimaryKeyRelatedField(
        queryset=HeritageSite.objects.all(),
        source='site',
        write_only=True,
        required=False,
        allow_null=True,
    )
    
    def create(self, validated_data):
        site = validated_data.get('site', None)
        print("Site passed to serializer create:", site)
        return super().create(validated_data)


    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_username', 'title', 'content', 'site', 'site_id',
            'image', 'video', 'created_at', 'updated_at', 'upvotes', 'downvotes'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at', 'upvotes', 'downvotes']


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_username', 'content', 'parent_comment', 'created_at', 'is_removed']
        read_only_fields = ['author', 'created_at']

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user', 'post', 'vote_type', 'created_at']
        read_only_fields = ['user', 'created_at']

class CommentVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentVote
        fields = ['id', 'user', 'comment', 'vote_type', 'created_at']
        read_only_fields = ['user', 'created_at']

class UserBadgeSerializer(serializers.ModelSerializer):
    site = HeritageSiteSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'site', 'earned_at']
