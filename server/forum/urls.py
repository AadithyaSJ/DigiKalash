from django.urls import path
from .views import (
    HeritageSiteListView,
    PostListCreateView, PostRetrieveUpdateDestroyView,
    CommentListCreateView, CommentRetrieveUpdateDestroyView,
    VoteCreateUpdateView, CommentVoteCreateUpdateView,
    UserBadgeListView, MyVoteForPostView
)

urlpatterns = [
    path('sites/', HeritageSiteListView.as_view(), name='heritage-site-list'),

    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:id>/', PostRetrieveUpdateDestroyView.as_view(), name='post-detail'),

    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:id>/', CommentRetrieveUpdateDestroyView.as_view(), name='comment-detail'),

    path('votes/', VoteCreateUpdateView.as_view(), name='vote-create'),
    path('comment-votes/', CommentVoteCreateUpdateView.as_view(), name='comment-vote-create'),

    path('mybadges/', UserBadgeListView.as_view(), name='user-badges'),

    path('posts/<int:post_id>/myvote/', MyVoteForPostView.as_view(), name='post-my-vote'),
]
