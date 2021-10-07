from django.shortcuts import redirect


def unauthenticated_user_only(view_func):
    def wrapper(request):
        if request.user.is_authenticated:
            return redirect("index")
        else:
            return view_func(request)

    return wrapper


def authenticated_user_only(view_func):
    def wrapper(request):
        if request.user.is_authenticated:
            return view_func(request)
        else:
            return redirect("login")

    return wrapper
