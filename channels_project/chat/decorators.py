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


def chat_group(view_func):
    def wrapper(request, first_user, second_user):
        if not request.user.is_authenticated:
            return redirect('login')

        if first_user == second_user:
            return redirect('login')

        if not request.user.id in [first_user, second_user]:
            return redirect('login')

        return view_func(request, first_user, second_user)

    return wrapper
