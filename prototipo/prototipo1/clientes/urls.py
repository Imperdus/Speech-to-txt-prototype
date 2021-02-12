from django.urls import path
from clientes.views import persons_list

urlpatterns = [
    path('list/', persons_list),

]
