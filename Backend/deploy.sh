#!/bin/bash

# AWS Deployment Script for Culinary AI Backend
# This script helps deploy your FastAPI backend to AWS

set -e

echo "🚀 Starting AWS deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    echo "Install with: pip install awscli"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install it first.${NC}"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure'${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites checked${NC}"

# Get AWS account ID and region
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=${AWS_REGION:-ap-southeast-2}
REPOSITORY_NAME="culinary-ai-backend"

echo "AWS Account ID: $ACCOUNT_ID"
echo "Region: $REGION"

# Create ECR repository if it doesn't exist
echo -e "${YELLOW}📦 Setting up ECR repository...${NC}"
aws ecr describe-repositories --repository-names $REPOSITORY_NAME --region $REGION 2>/dev/null || \
aws ecr create-repository --repository-name $REPOSITORY_NAME --region $REGION

# Get ECR login token
echo -e "${YELLOW}🔐 Logging into ECR...${NC}"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build Docker image
echo -e "${YELLOW}🏗️ Building Docker image...${NC}"
docker build -t $REPOSITORY_NAME .

# Tag image for ECR
IMAGE_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPOSITORY_NAME:latest"
docker tag $REPOSITORY_NAME:latest $IMAGE_URI

# Push image to ECR
echo -e "${YELLOW}📤 Pushing image to ECR...${NC}"
docker push $IMAGE_URI

echo -e "${GREEN}✅ Docker image pushed successfully!${NC}"
echo -e "${GREEN}Image URI: $IMAGE_URI${NC}"

echo ""
echo -e "${YELLOW}🎯 Next Steps:${NC}"
echo "1. Go to AWS Console → App Runner"
echo "2. Create a new service"
echo "3. Choose 'Container registry' as source"
echo "4. Use this image URI: $IMAGE_URI"
echo "5. Configure environment variables from .env.example"
echo ""
echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"