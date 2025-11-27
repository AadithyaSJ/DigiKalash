from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from rest_framework import generics, status
from rest_framework.response import Response
from .models import User
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .serializers import UserRegistrationSerializer
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import ListAPIView


# User Registration View
@csrf_exempt
@api_view(['POST'])
def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')  # redirect to homepage or dashboard
    else:
        form = CustomUserCreationForm()
    return render(request, 'users/register.html', {'form': form})

# User Login View
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')  # redirect to homepage or dashboard
    else:
        form = AuthenticationForm()
    return render(request, 'users/login.html', {'form': form})

# User Logout View
def logout_view(request):
    logout(request)
    return redirect('login')

# User Profile View
def profile_view(request):
    return render(request, 'users/profile.html', {'user': request.user})

# User Profile Edit View
def profile_edit_view(request):
    if request.method == 'POST':
        form = CustomUserChangeForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = CustomUserChangeForm(instance=request.user)
    return render(request, 'users/profile_edit.html', {'form': form})


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]  
    def get_serializer_context(self):
        return {'request': self.request}

class UserProfileView(RetrieveAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserListView(ListAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [IsAdminUser]

    queryset = User.objects.all()

class UserVerifyView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    lookup_field = 'username'  # <-- This line fixes the URL kwarg mismatch

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_verified = request.data.get('is_verified', True)
        user.save()
        return Response({'status': 'user verified'}, status=status.HTTP_200_OK)
    
class UserDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    lookup_field = 'username'  # <-- important for username lookup
