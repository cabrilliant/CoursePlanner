from django.urls import path
from . import views

urlpatterns = [
    path('', views.plan, name='courseplanner-planner'),
    path('validate/', views.validate_drop),
    path('getRec/', views.getRec),
    path('search/', views.search),
    path('reqBarHandler/',views.reqBarHandler),
    path('getUnits/',views.getUnits),
    path('reversePres/', views.reversePres)
]
