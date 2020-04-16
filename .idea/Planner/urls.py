from django.urls import path
from . import views

urlpatterns = [
    path('', views.plan, name='courseplanner-planner'),
    path('validate/', views.validate_drop),
]
