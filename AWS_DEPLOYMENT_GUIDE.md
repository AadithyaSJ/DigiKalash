# AWS Deployment Guide - VRwarriors Backend

This guide will help you deploy your Django backend to AWS using ECS (Elastic Container Service) and RDS (Relational Database Service).

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Docker installed locally
- GitHub account with your code pushed
- Domain name (optional, for production)

## Step 1: Create an ECR Repository

1. Go to **AWS ECR (Elastic Container Registry)**
2. Click **Create repository**
3. Name it: `vrwarriors-backend`
4. Leave settings as default
5. Click **Create repository**

## Step 2: Create RDS Database

1. Go to **AWS RDS Dashboard**
2. Click **Create database**
3. Setup:
   - Engine: **PostgreSQL** (version 15 or later)
   - Template: **Free tier** (for testing)
   - DB name: `vrwarriors_db`
   - Master username: `admin`
   - Master password: Create a strong password
   - Instance class: `db.t3.micro` (free tier)
   - Storage: 20 GB
   - Multi-AZ: No (for now)
4. Click **Create database**
5. Note the **Endpoint** - you'll need this in `.env`

## Step 3: Setup Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your values:
   ```
   DEBUG=False
   SECRET_KEY=generate-a-secure-key
   DB_HOST=your-rds-endpoint.rds.amazonaws.com
   DB_PASSWORD=your-strong-password
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   ```

3. Generate a secure SECRET_KEY:
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

## Step 4: Update Django Settings for Production

Edit `server/core/settings.py`:

```python
import os
from decouple import config

DEBUG = config('DEBUG', default=False, cast=bool)
SECRET_KEY = config('SECRET_KEY')
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.postgresql'),
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# AWS S3 Configuration
USE_S3 = config('USE_S3', default=False, cast=bool)
if USE_S3:
    AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='us-east-1')
    
    STATIC_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/static/'
    MEDIA_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/media/'
    STATIC_ROOT = 'staticfiles/'
    MEDIA_ROOT = 'media/'
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'

# CORS
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')

# Security
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'
```

## Step 5: Build and Push Docker Image

```bash
# Get your ECR repository URI from AWS Console

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build Docker image
docker build -t vrwarriors-backend .

# Tag image
docker tag vrwarriors-backend:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vrwarriors-backend:latest

# Push to ECR
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vrwarriors-backend:latest
```

## Step 6: Create ECS Cluster and Task Definition

### Create Cluster:
1. Go to **ECS Dashboard**
2. Click **Clusters** → **Create Cluster**
3. Name: `vrwarriors-cluster`
4. Infrastructure: **AWS Fargate**
5. Click **Create**

### Create Task Definition:
1. Go to **Task Definitions** → **Create new task definition**
2. Setup:
   - Name: `vrwarriors-backend-task`
   - Container name: `vrwarriors-backend`
   - Image URI: `YOUR_ECR_IMAGE_URI`
   - Container port: `8000`
   - Memory: `512` MB
   - Environment variables: Add from `.env`
3. Click **Create**

## Step 7: Create ECS Service

1. Go to your cluster → **Services** → **Create**
2. Setup:
   - Launch type: **Fargate**
   - Task definition: `vrwarriors-backend-task`
   - Desired tasks: `1` (scale up later)
   - Load balancer: **Application Load Balancer**
3. Configure load balancer:
   - Create new or use existing ALB
   - Target group: `vrwarriors-backend`
   - Port: `8000`
4. Click **Create**

## Step 8: Create S3 Bucket for Media/Static Files

1. Go to **S3 Dashboard**
2. Click **Create bucket**
3. Name: `vrwarriors-media-YOURUNIQUEID`
4. Region: `us-east-1`
5. Configure permissions:
   - Block public access: Keep default
   - Add bucket policy for your backend to access

## Step 9: Run Migrations

Once service is running:

```bash
# Run migrations in ECS task
aws ecs execute-command \
  --cluster vrwarriors-cluster \
  --task <task-id> \
  --container vrwarriors-backend \
  --interactive \
  --command "/bin/bash"

# Inside the container:
python manage.py migrate
python manage.py createsuperuser
```

## Step 10: Setup Domain with Route 53 (Optional)

1. Register domain in **Route 53** or use existing domain
2. Create **A record** pointing to your **ALB DNS**
3. Update `ALLOWED_HOSTS` in settings

## Monitoring and Debugging

### View Logs:
```bash
aws logs tail /ecs/vrwarriors-backend --follow
```

### SSH into Container:
```bash
aws ecs execute-command \
  --cluster vrwarriors-cluster \
  --task <task-id> \
  --container vrwarriors-backend \
  --interactive \
  --command "/bin/bash"
```

## Cost Optimization

- Use **Fargate Spot** for non-critical workloads
- Set up **Auto Scaling** based on CPU/Memory
- Use **Free Tier** for testing
- Delete unused resources (RDS, ALB, etc.)

## Frontend Deployment

For your React/Vite frontend:
- Deploy to **AWS Amplify** or **CloudFront + S3**
- Update `CORS_ALLOWED_ORIGINS` in Django to include frontend URL

## Troubleshooting

**502 Bad Gateway**: Check security groups and task logs
**Database connection failed**: Verify RDS endpoint and security group rules
**Static files not loading**: Verify S3 bucket permissions and URL
**CORS errors**: Check `CORS_ALLOWED_ORIGINS` setting

## Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Django on AWS](https://aws.amazon.com/blogs/mobile/deploy-django/)
- [AWS RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
