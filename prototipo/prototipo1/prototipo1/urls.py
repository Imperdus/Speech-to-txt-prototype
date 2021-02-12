from django.contrib import admin
from django.urls import path, include
from .views import stt
from clientes import urls as clients_urls

urlpatterns = [
    path('stt/', stt),
    path('user/', include(clients_urls)),
    path('admin/', admin.site.urls),
]
