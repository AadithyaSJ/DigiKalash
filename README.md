# VRwarriors - Django Backend + React Frontend

A comprehensive cultural heritage platform featuring Django REST API backend and React frontend.

## Project Structure

```
VRwarriors2/
├── server/           # Django backend
│   ├── core/         # Django settings
│   ├── users/        # User management
│   ├── heritage/     # Heritage sites
│   ├── marketplace/  # Artisan marketplace
│   ├── forum/        # Discussion forum
│   └── events/       # Events management
│
└── client/           # React + Vite frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── api.js     # API integration
    └── package.json
```

## Development Setup

### Backend
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Access at: `http://localhost:5173`

## Production Deployment

See [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md) for complete deployment instructions.

### Quick Start:
1. Set environment variables in `.env`
2. Update `.env.example` with your AWS credentials
3. Run `./server/deploy.sh` to push to ECR
4. Create ECS service and task definition in AWS

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Django
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,yourdomain.com

# Database (RDS PostgreSQL)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=vrwarriors_db
DB_USER=admin
DB_PASSWORD=your-password
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432

# AWS S3
USE_S3=True
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=your-bucket

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

## API Documentation

Base URL: `http://localhost:8000/api/`

### Authentication
- POST `/users/login/` - Login
- POST `/users/register/` - Register
- POST `/users/logout/` - Logout

### Heritage Sites
- GET `/heritage/sites/` - List all sites
- GET `/heritage/sites/{id}/` - Get site details
- POST `/heritage/sites/` - Create (authenticated)

### Marketplace
- GET `/marketplace/products/` - List all products
- POST `/marketplace/products/` - Create (authenticated)

### Forum
- GET `/forum/posts/` - List all posts
- POST `/forum/posts/` - Create post (authenticated)

## Technologies

### Backend
- Django 5.0
- Django REST Framework
- PostgreSQL
- Gunicorn
- AWS ECS + RDS + S3

### Frontend
- React 18
- Vite
- Axios
- CSS3

## Testing

```bash
# Backend
python manage.py test

# Frontend
npm run test
```

## Deployment Status

- Frontend: AWS Amplify / CloudFront
- Backend: ECS Fargate + RDS PostgreSQL + S3
- CI/CD: GitHub Actions

## Troubleshooting

### Database Connection Failed
```bash
# Check RDS endpoint and security groups
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,Endpoint.Address]'
```

### Static Files Not Loading
```bash
# Ensure S3 bucket is configured and ACLs are correct
aws s3api list-objects-v2 --bucket your-bucket --prefix static/
```

### Logs
```bash
# View ECS logs
aws logs tail /ecs/vrwarriors-backend --follow
```

## Contributing

1. Create feature branch
2. Make changes
3. Push to GitHub
4. Create Pull Request

## Support

For deployment issues, see [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md)

## License

MIT
