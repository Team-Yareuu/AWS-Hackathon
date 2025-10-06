# Quick Deployment Guide

## Prerequisites Complete ✅
- ✅ Conda environment `aws-deploy` created with Python 3.12
- ✅ AWS CLI installed and configured
- ✅ Docker image configuration ready
- ✅ FastAPI application prepared for deployment

## Next Steps

### 1. Start Docker Desktop
Before proceeding, make sure Docker Desktop is running:
- Open Docker Desktop application
- Wait for it to fully start (whale icon should be stable)

### 2. Deploy to AWS
Run the deployment script:
```powershell
.\deploy.ps1
```

### 3. Alternative: Manual ECR Push
If the script doesn't work, you can manually push:

```powershell
# Build image
docker build -t culinary-ai-backend .

# Get account ID  
$ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)

# Create ECR repo
aws ecr create-repository --repository-name culinary-ai-backend --region ap-southeast-2

# Login to ECR
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com

# Tag and push
docker tag culinary-ai-backend:latest $ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com/culinary-ai-backend:latest
docker push $ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com/culinary-ai-backend:latest
```

### 4. Create App Runner Service

1. Go to [AWS Console → App Runner](https://console.aws.amazon.com/apprunner)
2. Click "Create service"
3. Choose "Container registry" → "Amazon ECR"
4. Select your image: `839185960740.dkr.ecr.ap-southeast-2.amazonaws.com/culinary-ai-backend:latest`
5. Service name: `culinary-ai-backend`
6. Configure environment variables:
   ```
   AWS_REGION=ap-southeast-2
   NEO4J_URI=neo4j+s://06ad204b.databases.neo4j.io
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=oW_2ABAMPHHR4ErTvY8hJT2HM6kMbLGo8fj1wYTtFxQ
   SECRET_KEY=your_very_secure_secret_key_here_please_change_this
   API_V1_STR=/api/v1
   ```
7. Click "Create & deploy"

### 5. Test Your Deployment
Once deployed, test your API:
```powershell
# Get your App Runner URL from the console, then test:
curl https://your-app-url.apprunner.region.amazonaws.com/
curl https://your-app-url.apprunner.region.amazonaws.com/api/v1/
```

### 6. Clean Up (After Testing)
To delete the conda environment after deployment:
```powershell
conda deactivate
conda remove -n aws-deploy --all -y
```

## Troubleshooting

**Docker not running:**
- Start Docker Desktop
- Wait for it to fully initialize

**AWS permissions error:**
- Ensure your AWS user has ECR and App Runner permissions
- Check AWS credentials with `aws sts get-caller-identity`

**Build errors:**
- Check if all files are in the correct location
- Verify requirements.txt is accessible

**App Runner deployment fails:**
- Check CloudWatch logs in AWS Console
- Verify environment variables are set correctly
- Ensure your image is in ECR and publicly accessible

## Security Notes
- Never commit your actual credentials to Git
- Use IAM roles in production instead of access keys
- Consider using AWS Secrets Manager for sensitive data
- Update the SECRET_KEY before production deployment