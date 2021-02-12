from django.shortcuts import render


# views
def persons_list(request):
    return render(request, 'crudm.html')
