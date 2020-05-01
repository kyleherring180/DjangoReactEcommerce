from rest_framework.routers import DefaultRouter
from django.urls import path
from articles.api.views import ArticleViewSet

router = DefaultRouter()
router.register(r'', ArticleViewSet, basename='articles')
urlpatterns = router.urls
