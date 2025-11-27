from django.urls import path
from .views import (
    HeritageSiteList,
    HeritageSiteDetail,
    HeritageSiteCreate,
    HeritageEventList,
    HeritageEventCreate,
    HeritageEventDetail,
    UpcomingEvents,
    ImpactNumbers,
    HeritageResourceListView,
    HeritageResourceCreateView
)

urlpatterns = [
    path('sites/', HeritageSiteList.as_view(), name='heritage-sites-list'),
    path('sites/add/', HeritageSiteCreate.as_view(), name='heritage-sites-add'),
    path('sites/<int:pk>/', HeritageSiteDetail.as_view(), name='heritage-site-detail'),

    path('sites/<int:site_id>/events/', HeritageEventList.as_view(), name='heritage-events-list'),
    path('sites/<int:site_id>/events/add/', HeritageEventCreate.as_view(), name='heritage-events-add'),
    path('sites/<int:site_id>/events/<int:pk>/', HeritageEventDetail.as_view(), name='heritage-event-detail'),

    path('events/upcoming/', UpcomingEvents.as_view(), name='upcoming-events'),
    path('stats/numbers/', ImpactNumbers.as_view(), name='impact-numbers'),

    path('sites/<int:site_id>/resources/', HeritageResourceListView.as_view(), name='site-resources'),
    path('sites/<int:site_id>/resources/add/', HeritageResourceCreateView.as_view(), name='add-site-resource'),
]
