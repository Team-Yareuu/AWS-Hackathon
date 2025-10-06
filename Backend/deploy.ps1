# AWS Deployment Script for Culinary AI Backend (PowerShell)
# This script helps deploy your FastAPI backend to AWS

param(
    [string]$DeploymentType = "apprunner"
)

Write-Host "🚀 Starting AWS deployment process..." -ForegroundColor Green

# Colors for output
$ErrorColor = "Red"
$SuccessColor = "Green" 
$WarningColor = "Yellow"
$InfoColor = "Cyan"

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor $SuccessColor
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor $ErrorColor
    Write-Host "💡 Start Docker Desktop and try again." -ForegroundColor $WarningColor
    exit 1
}

# Check if AWS CLI is configured
try {
    $awsIdentity = aws sts get-caller-identity --output json | ConvertFrom-Json
    Write-Host "✅ AWS CLI configured for account: $($awsIdentity.Account)" -ForegroundColor $SuccessColor
} catch {
    Write-Host "❌ AWS CLI not configured. Please run 'aws configure'" -ForegroundColor $ErrorColor
    exit 1
}

# Variables
$AccountId = $awsIdentity.Account
$Region = "ap-southeast-2"
$RepositoryName = "culinary-ai-backend"
$ImageTag = "latest"

Write-Host "📋 Deployment Configuration:" -ForegroundColor $InfoColor
Write-Host "   Account ID: $AccountId"
Write-Host "   Region: $Region"
Write-Host "   Repository: $RepositoryName"

# Create ECR repository if it doesn't exist
Write-Host "📦 Setting up ECR repository..." -ForegroundColor $WarningColor
try {
    aws ecr describe-repositories --repository-names $RepositoryName --region $Region | Out-Null
    Write-Host "✅ ECR repository '$RepositoryName' already exists" -ForegroundColor $SuccessColor
} catch {
    Write-Host "Creating new ECR repository..." -ForegroundColor $InfoColor
    aws ecr create-repository --repository-name $RepositoryName --region $Region | Out-Null
    Write-Host "✅ ECR repository '$RepositoryName' created" -ForegroundColor $SuccessColor
}

# Get ECR login token
Write-Host "🔐 Logging into ECR..." -ForegroundColor $WarningColor
$loginCommand = aws ecr get-login-password --region $Region
if ($LASTEXITCODE -eq 0) {
    $loginCommand | docker login --username AWS --password-stdin "$AccountId.dkr.ecr.$Region.amazonaws.com"
    Write-Host "✅ Logged into ECR successfully" -ForegroundColor $SuccessColor
} else {
    Write-Host "❌ Failed to get ECR login token" -ForegroundColor $ErrorColor
    exit 1
}

# Build Docker image
Write-Host "🏗️ Building Docker image..." -ForegroundColor $WarningColor
docker build -t $RepositoryName .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully" -ForegroundColor $SuccessColor
} else {
    Write-Host "❌ Failed to build Docker image" -ForegroundColor $ErrorColor
    exit 1
}

# Tag image for ECR
$ImageUri = "$AccountId.dkr.ecr.$Region.amazonaws.com/$RepositoryName`:$ImageTag"
docker tag "$RepositoryName`:latest" $ImageUri
Write-Host "🏷️ Tagged image: $ImageUri" -ForegroundColor $InfoColor

# Push image to ECR
Write-Host "📤 Pushing image to ECR..." -ForegroundColor $WarningColor
docker push $ImageUri
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Image pushed successfully!" -ForegroundColor $SuccessColor
} else {
    Write-Host "❌ Failed to push image to ECR" -ForegroundColor $ErrorColor
    exit 1
}

Write-Host ""
Write-Host "🎯 Deployment Complete!" -ForegroundColor $SuccessColor
Write-Host "Image URI: $ImageUri" -ForegroundColor $InfoColor
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor $WarningColor
Write-Host "1. Go to AWS Console → App Runner"
Write-Host "2. Create a new service"
Write-Host "3. Choose 'Container registry' as source"
Write-Host "4. Use this image URI: $ImageUri"
Write-Host "5. Configure environment variables:"
Write-Host "   - AWS_REGION=ap-southeast-2"
Write-Host "   - NEO4J_URI=neo4j+s://06ad204b.databases.neo4j.io"
Write-Host "   - NEO4J_USER=neo4j"
Write-Host "   - NEO4J_PASSWORD=<your_neo4j_password>"
Write-Host "   - SECRET_KEY=<your_secure_secret_key>"
Write-Host "   - API_V1_STR=/api/v1"
Write-Host ""
Write-Host "🌐 Alternative: Quick App Runner Setup"
Write-Host "Run: .\deploy.ps1 -DeploymentType quicksetup"
Write-Host ""
Write-Host "🎉 Your backend is ready for deployment!" -ForegroundColor $SuccessColor