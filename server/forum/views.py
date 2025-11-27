from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Post, Comment, Vote, CommentVote, UserBadge
from heritage.models import HeritageSite
from .serializers import PostSerializer, CommentSerializer, VoteSerializer, CommentVoteSerializer, UserBadgeSerializer, HeritageSiteSerializer

# Heritage Sites - List and Create (if needed)
class HeritageSiteListView(generics.ListAPIView):
    queryset = HeritageSite.objects.all()
    serializer_class = HeritageSiteSerializer
    permission_classes = [permissions.AllowAny]

class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Post.objects.filter(is_removed=False).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.filter(is_removed=False)
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'

    def perform_destroy(self, instance):
        instance.is_removed = True
        instance.save()

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_id'], is_removed=False).order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.filter(is_removed=False)
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'

    def perform_destroy(self, instance):
        instance.is_removed = True
        instance.save()

class VoteCreateUpdateView(generics.CreateAPIView):
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        post_id = self.request.data.get('post')
        vote_type = serializer.validated_data.get('vote_type')

        existing_vote = Vote.objects.filter(user=user, post_id=post_id).first()

        if existing_vote:
            if existing_vote.vote_type == vote_type:
                # same vote: remove vote (unvote)
                existing_vote.delete()
            else:
                # change vote type (upvote <-> downvote)
                existing_vote.vote_type = vote_type
                existing_vote.save()
            serializer.instance = existing_vote
        else:
            serializer.save(user=user)

        # Update post vote counts
        post = Post.objects.filter(pk=post_id).first()
        if post:
            post.update_vote_counts()

class CommentVoteCreateUpdateView(generics.CreateAPIView):
    serializer_class = CommentVoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        comment_id = self.request.data.get('comment')
        existing_vote = CommentVote.objects.filter(user=self.request.user, comment_id=comment_id).first()
        if existing_vote:
            existing_vote.vote_type = serializer.validated_data['vote_type']
            existing_vote.save()
            serializer.instance = existing_vote
        else:
            serializer.save(user=self.request.user)

class UserBadgeListView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)

class MyVoteForPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        try:
            vote = Vote.objects.get(user=request.user, post_id=post_id)
            return Response({'vote_type': vote.vote_type})
        except Vote.DoesNotExist:
            return Response({'vote_type': None})
