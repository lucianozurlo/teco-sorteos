from django.urls import path
from sorteo_app import views

urlpatterns = [
    path('', views.render_articles, name='articles')
]