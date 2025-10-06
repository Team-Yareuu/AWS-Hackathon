# 🐳 Docker Deployment Guide

Complete guide for building and deploying the Culinary AI Backend using Docker.

## 📋 Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (included with Docker Desktop)
- AWS credentials with Bedrock access
- Git repository cloned

## 🚀 Quick Start

### 1. Setup Environment Variables

Copy the example environment file and configure your credentials:

```bash
cd Backend
cp .env.example .env
```

Edit `.env` file with your actual credentials:
```env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_actual_key
AWS_SECRET_ACCESS_KEY=your_actual_secret
NEO4J_PASSWORD=your_strong_password
```

### 2. Build and Run with Docker Compose

**Start all services (Backend + Neo4j):**
```bash
docker-compose up -d
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Neo4j only
docker-compose logs -f neo4j
```

**Stop services:**
```bash
docker-compose down
```

**Stop and remove volumes (clean slate):**
```bash
docker-compose down -v
```

### 3. Access the Application

- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **Neo4j Browser**: http://localhost:7474
  - Username: `neo4j`
  - Password: (from your `.env` file)

## 🔨 Build Docker Image Only

If you want to build just the backend image without Neo4j:

```bash
# Build image
docker build -t culinary-ai-backend:latest .

# Run container
docker run -d \
  --name culinary-backend \
  -p 8000:8000 \
  --env-file .env \
  culinary-ai-backend:latest
```

## 📦 Push to Docker Hub

**1. Tag your image:**
```bash
docker tag culinary-ai-backend:latest your-dockerhub-username/culinary-ai-backend:latest
```

**2. Login to Docker Hub:**
```bash
docker login
```

**3. Push image:**
```bash
docker push your-dockerhub-username/culinary-ai-backend:latest
```

**4. Pull and run from anywhere:**
```bash
docker pull your-dockerhub-username/culinary-ai-backend:latest
docker run -d -p 8000:8000 --env-file .env your-dockerhub-username/culinary-ai-backend:latest
```

## ☁️ Deploy to Cloud Platforms

### Deploy to Render.com

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: culinary-ai-backend
    env: docker
    dockerfilePath: ./Backend/Dockerfile
    dockerContext: ./Backend
    envVars:
      - key: AWS_REGION
        value: ap-southeast-2
      - key: NEO4J_URI
        sync: false
      - key: NEO4J_USERNAME
        sync: false
      - key: NEO4J_PASSWORD
        sync: false
```

2. Connect GitHub repo to Render
3. Add environment variables in dashboard
4. Deploy!

### Deploy to Railway.app

1. Connect GitHub repository
2. Select Backend folder as root
3. Add environment variables
4. Railway will auto-detect Dockerfile
5. Deploy!

### Deploy to Fly.io

```bash
# Login
fly auth login

# Launch app
cd Backend
fly launch

# Set secrets
fly secrets set \
  AWS_REGION=ap-southeast-2 \
  AWS_ACCESS_KEY_ID=your_key \
  AWS_SECRET_ACCESS_KEY=your_secret \
  NEO4J_URI=your_neo4j_uri \
  NEO4J_USERNAME=neo4j \
  NEO4J_PASSWORD=your_password

# Deploy
fly deploy
```

### Deploy to AWS ECS

1. **Push to Amazon ECR:**
```bash
# Login to ECR
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com

# Create repository
aws ecr create-repository --repository-name culinary-ai-backend --region ap-southeast-2

# Tag and push
docker tag culinary-ai-backend:latest <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/culinary-ai-backend:latest
docker push <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/culinary-ai-backend:latest
```

2. **Create ECS Task Definition:**
- Use Fargate launch type
- Set image URI from ECR
- Configure environment variables
- Set CPU: 512, Memory: 1024

3. **Create ECS Service:**
- Create cluster
- Create service with task definition
- Configure load balancer
- Deploy!

## 🔧 Troubleshooting

### Backend can't connect to Neo4j
**Error:** `ServiceUnavailable: Could not connect to Neo4j`

**Solution:** 
- Ensure Neo4j is healthy: `docker-compose ps`
- Check NEO4J_URI in .env: `bolt://neo4j:7687` (for docker-compose)
- Wait for Neo4j to fully start (~30 seconds)

### Port already in use
**Error:** `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution:**
```bash
# Find process using port
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Mac/Linux

# Kill process or change port in docker-compose.yml
```

### Permission denied errors
**Solution:**
```bash
# On Linux/Mac, fix permissions
sudo chown -R $(whoami):$(whoami) .
```

### AWS credentials not working
**Solution:**
- Verify credentials: `aws sts get-caller-identity`
- Check Bedrock access in IAM
- Ensure region is correct (ap-southeast-2)

## 🧪 Testing the Deployment

### Health Check
```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "status": "ok",
  "message": "Welcome to the Culinary AI Backend!"
}
```

### Test Recipe Endpoint
```bash
curl http://localhost:8000/api/v1/recipes/
```

### Run Migration Script
```bash
# Enter backend container
docker-compose exec backend bash

# Run migration
python -m app.migration
```

## 📊 Monitoring

### View container stats
```bash
docker stats
```

### View container logs
```bash
docker-compose logs -f --tail=100 backend
```

### Exec into container
```bash
docker-compose exec backend bash
```

## 🔄 Update Deployment

When you make code changes:

```bash
# Rebuild and restart
docker-compose up -d --build

# Or force recreate
docker-compose up -d --force-recreate --build
```

## 🛡️ Production Best Practices

1. **Use secrets management:**
   - AWS Secrets Manager
   - Docker secrets
   - Environment-specific .env files

2. **Enable HTTPS:**
   - Use reverse proxy (Nginx, Traefik)
   - Configure SSL certificates
   - Use Let's Encrypt for free SSL

3. **Set resource limits:**
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

4. **Use health checks:**
   - Already configured in docker-compose.yml
   - Monitor with container orchestration tools

5. **Backup Neo4j data:**
```bash
# Backup
docker-compose exec neo4j neo4j-admin dump --database=neo4j --to=/backups/neo4j-backup.dump

# Restore
docker-compose exec neo4j neo4j-admin load --from=/backups/neo4j-backup.dump --database=neo4j --force
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Docker Guide](https://fastapi.tiangolo.com/deployment/docker/)
- [Neo4j Docker Guide](https://neo4j.com/docs/operations-manual/current/docker/)
