from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    site = models.ForeignKey('heritage.HeritageSite', on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    video = models.FileField(upload_to='post_videos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_removed = models.BooleanField(default=False)
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return self.title

    def update_vote_counts(self):
        self.upvotes = self.votes.filter(vote_type='UPVOTE').count()
        self.downvotes = self.votes.filter(vote_type='DOWNVOTE').count()
        self.save(update_fields=['upvotes', 'downvotes'])


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    parent_comment = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    is_removed = models.BooleanField(default=False)

    class Meta:
        indexes = [models.Index(fields=['created_at'])]

    def __str__(self):
        return f"Comment by {self.author} on {self.post}"

class Vote(models.Model):
    VOTE_TYPES = [('UPVOTE', 'Upvote'), ('DOWNVOTE', 'Downvote')]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='votes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='votes')
    vote_type = models.CharField(max_length=8, choices=VOTE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['post']),
        ]

    def __str__(self):
        return f"{self.vote_type} by {self.user} on {self.post}"


class CommentVote(models.Model):
    VOTE_TYPES = [('UPVOTE', 'Upvote'), ('DOWNVOTE', 'Downvote')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='votes')
    vote_type = models.CharField(max_length=8, choices=VOTE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')
        indexes = [models.Index(fields=['user']), models.Index(fields=['comment'])]

    def __str__(self):
        return f"{self.vote_type} by {self.user} on comment {self.comment.id}"

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    site = models.ForeignKey('heritage.HeritageSite', on_delete=models.CASCADE, related_name='badges')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'site')

    def __str__(self):
        return f"{self.user.username} badge for {self.site.name}"
