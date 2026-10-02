from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewset, ProductViewset

router = DefaultRouter()
router.register(r'categories', CategoryViewset, basename='category')
router.register(r'products', ProductViewset, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]