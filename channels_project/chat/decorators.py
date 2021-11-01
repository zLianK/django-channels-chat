from django.shortcuts import redirect


def unauthenticated_user_only(view_func):
    def wrapper(request):
        if request.user.is_authenticated:
            return redirect('index')
        return view_func(request)
    return wrapper


def authenticated_user_only(view_func):
    def wrapper(request):
        if request.user.is_authenticated:
            return view_func(request)
        return redirect('login')
    return wrapper


def chat(view_func):
    def wrapper(request, username):
        if not request.user.is_authenticated:
            return redirect('login')

        if username == request.user.username:
            return redirect('index')

        return view_func(request, username)
    return wrapper
