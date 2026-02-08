#!/bin/bash

# VRwarriors Backend Deployment Script
# This script builds and pushes Docker image to AWS ECR

set -e

# Configuration
AWS_REGION="us-east-1"
ECR_REPO_NAME="vrwarriors-backend"
IMAGE_TAG="latest"

echo "========================================"
echo "VRwarriors Backend Deployment"
echo "========================================"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
FULL_IMAGE_URI="$ECR_URI/$ECR_REPO_NAME:$IMAGE_TAG"

echo "AWS Account ID: $AWS_ACCOUNT_ID"
echo "ECR Repository: $FULL_IMAGE_URI"

# Step 1: Login to ECR
echo ""
echo "Step 1: Authenticating with AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

# Step 2: Build Docker image
echo ""
echo "Step 2: Building Docker image..."
docker build -t $FULL_IMAGE_URI .

# Step 3: Push to ECR
echo ""
echo "Step 3: Pushing image to ECR..."
docker push $FULL_IMAGE_URI

echo ""
echo "========================================"
echo "✓ Deployment Complete!"
echo "Image URI: $FULL_IMAGE_URI"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Create/Update ECS Task Definition with image URI"
echo "2. Update ECS Service to use new task definition"
echo "3. Monitor deployment in AWS Console"
