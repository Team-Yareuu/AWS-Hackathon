# AWS Deployment Guide

This guide will help you deploy your FastAPI backend to AWS using different deployment options.

## Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   # Install AWS CLI
   pip install awscli
   
   # Configure AWS credentials
   aws configure
   ```

2. **Docker installed** (for containerized deployments)

3. **Environment Variables Setup**
   - Copy `.env.example` to `.env`
   - Fill in your actual values for sensitive data

## Deployment Options

### Option 1: AWS App Runner (Recommended for FastAPI)

AWS App Runner is perfect for containerized web applications.

#### Steps:

1. **Push your code to GitHub** (if not already done)

2. **Create App Runner Service:**
   - Go to AWS Console → App Runner
   - Click "Create service"
   - Choose "Source code repository" → GitHub
   - Connect your GitHub account and select this repository
   - Choose branch: `main`
   - Choose runtime: `Docker`
   - Use the `apprunner.yaml` configuration file

3. **Configure Environment Variables:**
   In the App Runner service configuration, add these environment variables:
   ```
   AWS_ACCESS_KEY_ID=<your_aws_access_key>
   AWS_SECRET_ACCESS_KEY=<your_aws_secret_key>
   NEO4J_PASSWORD=<your_neo4j_password>
   SECRET_KEY=<your_secret_key>
   ```

4. **Review and Deploy**

### Option 2: AWS ECS with Fargate

For more control over your container deployment.

#### Steps:

1. **Build and push Docker image to ECR:**
   ```bash
   # Create ECR repository
   aws ecr create-repository --repository-name culinary-ai-backend --region ap-southeast-2
   
   # Get login token
   aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com
   
   # Build image
   docker build -t culinary-ai-backend .
   
   # Tag image
   docker tag culinary-ai-backend:latest <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/culinary-ai-backend:latest
   
   # Push image
   docker push <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/culinary-ai-backend:latest
   ```

2. **Create ECS Task Definition and Service** through AWS Console

### Option 3: AWS Lambda with Mangum (Serverless)

For serverless deployment.

#### Additional Requirements:
```bash
pip install mangum
```

#### Modify main.py:
```python
from mangum import Mangum
from app.main import app

# Add this at the end of main.py
handler = Mangum(app)
```

#### Deploy with AWS SAM or Serverless Framework

## Environment Variables for Production

Make sure to set these in your chosen AWS service:

- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key  
- `AWS_REGION` - ap-southeast-2
- `NEO4J_URI` - Your Neo4j connection string
- `NEO4J_USER` - neo4j
- `NEO4J_PASSWORD` - Your Neo4j password
- `SECRET_KEY` - A secure secret key for JWT tokens
- `API_V1_STR` - /api/v1

## Testing Your Deployment

Once deployed, test your API:

```bash
# Health check
curl https://your-app-url.com/

# Test API endpoint
curl https://your-app-url.com/api/v1/recipes/
```

## Security Considerations

1. **Never commit secrets to Git**
2. **Use AWS IAM roles** instead of access keys when possible
3. **Enable CORS** only for your frontend domain in production
4. **Use HTTPS** in production
5. **Set up CloudWatch** for monitoring

## Troubleshooting

- Check CloudWatch logs for application errors
- Verify environment variables are set correctly
- Ensure your AWS credentials have necessary permissions
- Check security groups and network settings for ECS deployments