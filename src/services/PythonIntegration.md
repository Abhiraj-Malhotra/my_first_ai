# Integrating Python AI Model with React Frontend

## Overview
This document explains how to integrate your Python AI model and CSV dataset with this React frontend.

## Backend Setup

### 1. Create a Django API Backend

```bash
# Install Django and Django REST framework
pip install django djangorestframework django-cors-headers

# Create a new Django project
django-admin startproject chatbot_backend
cd chatbot_backend

# Create an API app
python manage.py startapp api
```

### 2. Configure Django Settings

In `chatbot_backend/settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]

# Allow requests from your React app
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "https://keen-nobel7-cwf77.view-3.tempo-dev.app",  # Your Tempo URL
]
```

### 3. Create API Endpoints

In `api/views.py`:

```python
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Import your AI model
# from .model import YourAIModel

class ChatbotView(APIView):
    def __init__(self):
        # Load your CSV dataset
        self.data = pd.read_csv('path/to/your/dataset.csv')
        
        # Initialize your AI model
        # self.model = YourAIModel()
        
    def post(self, request):
        message = request.data.get('message', '')
        
        if not message:
            return Response({'error': 'No message provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Process the message with your AI model
            # response = self.model.generate_response(message, self.data)
            
            # For testing, you can use a mock response
            response = f"This is a mock response to: {message}"
            
            return Response({'response': response})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

### 4. Configure URLs

In `api/urls.py`:

```python
from django.urls import path
from .views import ChatbotView

urlpatterns = [
    path('chat/', ChatbotView.as_view(), name='chat'),
]
```

In `chatbot_backend/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

### 5. Integrate Your AI Model

Create `api/model.py` to implement your AI model:

```python
class YourAIModel:
    def __init__(self):
        # Initialize your model here
        pass
        
    def generate_response(self, user_input, data):
        # Your AI logic here
        # Process the user_input using your model and the CSV data
        # Return the response
        pass
```

## Running the Backend

```bash
python manage.py runserver
```

## Frontend Configuration

1. Set the API URL in your environment variables:

```
VITE_API_URL=http://localhost:8000/api
```

2. For production deployment, update the API URL to point to your deployed Django backend.

## Deployment Options

1. **Development**: Run Django locally and connect to it from your React app
2. **Production**: Deploy Django to a service like:
   - Heroku
   - PythonAnywhere
   - AWS Elastic Beanstalk
   - Google Cloud Run

## Testing the Integration

1. Start your Django backend
2. Start your React frontend
3. Send a test message through the chat interface
4. Verify that the request reaches your Django backend and returns a response

## Advanced Integration

- Add authentication to secure your API
- Implement WebSockets for real-time communication
- Add rate limiting to prevent abuse
- Cache common responses for better performance
