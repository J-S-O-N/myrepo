# AWS Development Environment Setup

## Current Status

### Prerequisites Installed ✓/✗
- ✗ AWS CLI - **NEEDS INSTALLATION**
- ✗ Terraform - **NEEDS INSTALLATION**
- ✗ Docker - **NEEDS INSTALLATION**
- ✓ Node.js - Available at `/opt/homebrew/bin/node`
- ✓ npm - v25.3.0

## Installation Steps

### 1. Install AWS CLI

```bash
# Download AWS CLI installer for macOS
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"

# Install
sudo installer -pkg AWSCLIV2.pkg -target /

# Verify
aws --version
```

### 2. Install Terraform

```bash
# Download Terraform for macOS (ARM64 for M1/M2/M3)
curl -LO https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_darwin_arm64.zip

# Unzip
unzip terraform_1.7.0_darwin_arm64.zip

# Move to /usr/local/bin
sudo mv terraform /usr/local/bin/

# Verify
terraform --version
```

### 3. Install Docker Desktop

```bash
# Download Docker Desktop for Mac (Apple Silicon)
# Visit: https://www.docker.com/products/docker-desktop/

# Or use Homebrew if available:
# brew install --cask docker
```

**Manual Download**: https://desktop.docker.com/mac/main/arm64/Docker.dmg

After installation:
- Open Docker Desktop application
- Wait for Docker to start
- Verify: `docker --version`

## AWS Configuration

### 1. Configure AWS Credentials

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: [Your access key]
- **AWS Secret Access Key**: [Your secret key]
- **Default region**: us-east-1 (recommended for dev)
- **Default output format**: json

### 2. Verify AWS Access

```bash
# Test AWS connection
aws sts get-caller-identity

# Expected output:
# {
#     "UserId": "...",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/your-username"
# }
```

## Terraform Deployment

### 1. Initialize Terraform

```bash
cd /Users/jonathan.singh/CodeRepo/myrepo/terraform

# Initialize Terraform (downloads providers)
terraform init
```

### 2. Create Development Workspace

```bash
# Create dev workspace
terraform workspace new dev

# Verify you're on dev workspace
terraform workspace list
```

### 3. Deploy Infrastructure

```bash
# Review what will be created
terraform plan -var="environment=dev"

# Deploy (this will create ~$90/month of AWS resources)
terraform apply -var="environment=dev" -auto-approve
```

**Resources Created**:
- VPC with public/private subnets
- ECS Fargate cluster (0.25 vCPU, 512 MB RAM)
- RDS PostgreSQL (db.t3.micro)
- Application Load Balancer
- S3 bucket for frontend
- CloudFront distribution
- ECR repository for Docker images

### 4. Note the Outputs

After deployment completes, Terraform will output:
- **alb_dns_name**: Your backend API endpoint
- **cloudfront_domain**: Your frontend URL
- **ecr_repository_url**: Docker registry URL
- **rds_endpoint**: Database endpoint

Save these values!

## Build and Deploy Application

### 1. Build Docker Image

```bash
cd /Users/jonathan.singh/CodeRepo/myrepo

# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ECR_REPOSITORY_URL>

# Build Docker image
docker build -t bankapp:dev .

# Tag image for ECR
docker tag bankapp:dev <ECR_REPOSITORY_URL>:dev

# Push to ECR
docker push <ECR_REPOSITORY_URL>:dev
```

### 2. Deploy to ECS

The ECS service will automatically pull the latest image from ECR and deploy it.

```bash
# Force new deployment
aws ecs update-service \
  --cluster bankapp-dev \
  --service bankapp-dev-service \
  --force-new-deployment \
  --region us-east-1
```

### 3. Deploy Frontend to S3

```bash
cd /Users/jonathan.singh/CodeRepo/myrepo/TestAiApp

# Build frontend
npm run build

# Upload to S3 (replace with your bucket name from Terraform output)
aws s3 sync dist/ s3://bankapp-dev-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <CLOUDFRONT_DISTRIBUTION_ID> \
  --paths "/*"
```

## Verify Deployment

### 1. Check ECS Service Status

```bash
# Check ECS tasks
aws ecs list-tasks --cluster bankapp-dev --region us-east-1

# Describe task
aws ecs describe-tasks \
  --cluster bankapp-dev \
  --tasks <TASK_ARN> \
  --region us-east-1
```

### 2. Check Application Health

```bash
# Test backend API
curl https://<ALB_DNS_NAME>/health

# Expected: {"status":"ok"}
```

### 3. Access Frontend

Open your browser to: `https://<CLOUDFRONT_DOMAIN>`

## Local Development with AWS Dev Environment

### Connect to AWS RDS Database Locally

```bash
# Create SSH tunnel to RDS (if using bastion host)
# Or configure security group to allow your IP

# Update .env with RDS endpoint
cat > /Users/jonathan.singh/CodeRepo/myrepo/TestAiApp/.env << EOF
DB_DIALECT=postgres
DB_HOST=<RDS_ENDPOINT>
DB_PORT=5432
DB_NAME=testaiapp
DB_USER=postgres
DB_PASSWORD=<YOUR_RDS_PASSWORD>
JWT_SECRET=<YOUR_JWT_SECRET>
NODE_ENV=development
PORT=3001
EOF
```

### Run Backend Locally

```bash
cd /Users/jonathan.singh/CodeRepo/myrepo/TestAiApp

# Install dependencies
npm install

# Start backend
node server/index.cjs
```

### Run Frontend Locally

```bash
# In new terminal
cd /Users/jonathan.singh/CodeRepo/myrepo/TestAiApp

# Start dev server
npm run dev
```

## GitHub Actions CI/CD Setup

### Configure GitHub Secrets

Go to: https://github.com/Jonathan-Singh/myrepo/settings/secrets/actions

Add these secrets:
- `AWS_ACCESS_KEY_ID_DEV`
- `AWS_SECRET_ACCESS_KEY_DEV`
- `AWS_REGION` = us-east-1

### Enable Auto-Deploy

Once secrets are configured, pushing to `develop` branch will automatically:
1. Run tests
2. Build Docker image
3. Push to ECR
4. Deploy to ECS
5. Deploy frontend to S3/CloudFront

## Monitoring

### CloudWatch Logs

```bash
# View backend logs
aws logs tail /ecs/bankapp-dev --follow --region us-east-1
```

### ECS Service Metrics

```bash
# Get service details
aws ecs describe-services \
  --cluster bankapp-dev \
  --services bankapp-dev-service \
  --region us-east-1
```

## Cost Management

**Development Environment Monthly Cost**: ~$90

Breakdown:
- ECS Fargate: ~$10
- RDS db.t3.micro: ~$20
- ALB: ~$20
- Data transfer: ~$5
- CloudWatch: ~$5
- S3/CloudFront: ~$5
- NAT Gateway: ~$25

### Stop Dev Environment (to save costs)

```bash
# Stop ECS service
aws ecs update-service \
  --cluster bankapp-dev \
  --service bankapp-dev-service \
  --desired-count 0 \
  --region us-east-1

# Stop RDS instance
aws rds stop-db-instance \
  --db-instance-identifier bankapp-dev \
  --region us-east-1
```

### Destroy Dev Environment (complete teardown)

```bash
cd /Users/jonathan.singh/CodeRepo/myrepo/terraform

# Destroy all resources
terraform destroy -var="environment=dev" -auto-approve
```

## Troubleshooting

### Issue: ECS Task Won't Start

```bash
# Check task stopped reason
aws ecs describe-tasks \
  --cluster bankapp-dev \
  --tasks <TASK_ARN> \
  --region us-east-1 | grep -A 5 "stoppedReason"
```

### Issue: Can't Connect to RDS

- Check security group allows your IP
- Verify RDS is in public subnet (dev environment)
- Check RDS endpoint and credentials

### Issue: Frontend Not Loading

```bash
# Check S3 bucket contents
aws s3 ls s3://bankapp-dev-frontend/

# Check CloudFront distribution status
aws cloudfront get-distribution --id <DISTRIBUTION_ID>
```

## Next Steps

1. ☐ Install AWS CLI, Terraform, Docker
2. ☐ Configure AWS credentials
3. ☐ Deploy Terraform infrastructure
4. ☐ Build and push Docker image
5. ☐ Deploy application to ECS
6. ☐ Test deployment
7. ☐ Configure GitHub Actions
8. ☐ Enable auto-deploy on push to develop

## Resources

- [AWS Architecture Docs](./docs/AWS_ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [AWS Setup Summary](./docs/AWS_SETUP_SUMMARY.md)
