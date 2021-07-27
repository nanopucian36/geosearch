from django.urls import path
from . import views

app_name = 'final'
urlpatterns = [
    path('', views.index, name="index"),
    path('main/', views.main, name='main'),
    path('uploader/', views.Uploader, name='uploader'),
]