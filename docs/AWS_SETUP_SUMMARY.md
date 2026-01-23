# AWS Infrastructure Setup - Quick Start Guide

## 📋 Overview

This document provides a quick reference for the complete AWS infrastructure setup for BankApp across three environments: Development, Staging, and Production.

## 🏗️ What Was Created

### 1. Architecture Documentation
- **File**: [`AWS_ARCHITECTURE.md`](./AWS_ARCHITECTURE.md)
- **Contains**:
  - High-level architecture diagram
  - AWS services breakdown
  - Network architecture (VPC, subnets, security groups)
  - Cost estimates per environment
  - Disaster recovery strategy
  - Scaling strategy

### 2. Infrastructure as Code (Terraform)
- **Location**: `/terraform/`
- **Structure**:
  ```
  terraform/
  ├── main.tf                    # Root module
  ├── modules/
  │   ├── vpc/                   # VPC with public/private subnets
  │   ├── ecr/                   # Docker container registry
  │   ├── ecs/                   # ECS Fargate service
  │   ├── rds/                   # PostgreSQL database
  │   ├── alb/                   # Application Load Balancer
  │   ├── s3/                    # Frontend hosting
  │   └── cloudfront/            # CDN distribution
  └── environments/
      ├── dev/
      ├── staging/
      └── prod/
  ```

### 3. CI/CD Pipelines (GitHub Actions)
- **Location**: `/.github/workflows/`
- **Workflows**:
  - `deploy-dev.yml` - Auto-deploy on push to `develop` branch
  - `deploy-staging.yml` - Deploy to staging with approval
  - `deploy-prod.yml` - Production deployment with blue/green strategy
- **Features**:
  - Automated testing (unit, integration, e2e)
  - Security scanning (Trivy)
  - Docker image building and pushing to ECR
  - ECS service updates
  - Frontend deployment to S3/CloudFront
  - Automated rollback on failure

### 4. Docker Configuration
- **File**: `/Dockerfile`
- **Features**:
  - Multi-stage build (frontend + backend)
  - Production-optimized Node.js image
  - Non-root user for security
  - Health checks
  - Signal handling with dumb-init

### 5. Environment Configuration Templates
- **Files**:
  - `.env.development.template` - Local development
  - `.env.staging.template` - Staging environment
  - `.env.production.template` - Production environment
- **Includes**: Database config, AWS secrets, feature flags, security settings

### 6. Deployment Documentation
- **File**: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)
- **Covers**:
  - Prerequisites and tool installation
  - Step-by-step AWS setup
  - Infrastructure deployment instructions
  - CI/CD configuration
  - Monitoring and troubleshooting
  - Rollback procedures

## 🚀 Quick Start (15 Minutes)

### Step 1: Install Prerequisites (5 min)
```bash
# Install AWS CLI
brew install awscli  # macOS
# or download from https://aws.amazon.com/cli/

# Install Terraform
brew install terraform  # macOS
# or download from https://www.terraform.io/downloads

# Verify installations
aws --version
terraform --version
docker --version
node --version
```

### Step 2: Configure AWS (3 min)
```bash
# Configure AWS credentials
aws configure
# AWS Access Key ID: <your-key>
# AWS Secret Access Key: <your-secret>
# Default region: us-east-1
# Default output format: json

# Verify
aws sts get-caller-identity
```

### Step 3: Create Terraform State Backend (2 min)
```bash
# Create S3 bucket for Terraform state
aws s3 mb s3://bankapp-terraform-state --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket bankapp-terraform-state \
  --versioning-configuration Status=Enabled

# Create DynamoDB table for locking
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Step 4: Deploy Development Infrastructure (5 min)
```bash
# Navigate to Terraform directory
cd terraform

# Initialize Terraform
terraform init

# Create and select dev workspace
terraform workspace new dev

# Deploy infrastructure
terraform apply \
  -var="environment=dev" \
  -var="aws_region=us-east-1" \
  -auto-approve

# Save outputs
terraform output -json > outputs/dev-outputs.json
```

## 📊 Architecture Summary

### Development Environment
- **ECS Fargate**: 0.25 vCPU, 512 MB RAM (1 task)
- **RDS**: db.t3.micro (single AZ, SQLite alternative)
- **Cost**: ~$90/month
- **Auto-deploys** on push to `develop` branch

### Staging Environment
- **ECS Fargate**: 0.5 vCPU, 1 GB RAM (2 tasks)
- **RDS**: db.t3.small (Multi-AZ)
- **CloudFront**: Enabled
- **Cost**: ~$160/month
- **Requires approval** before deployment

### Production Environment
- **ECS Fargate**: 1 vCPU, 2 GB RAM (3-10 tasks with auto-scaling)
- **RDS**: db.t3.medium (Multi-AZ + read replica)
- **CloudFront**: Enabled with WAF
- **Cost**: ~$580/month
- **Blue/green deployment** with automated rollback

## 🔐 Security Features

### Network Security
- ✅ VPC with public/private subnets across 2 AZs
- ✅ NAT Gateways for private subnet internet access
- ✅ Security groups with least privilege access
- ✅ VPC Flow Logs for production

### Data Security
- ✅ RDS encryption at rest
- ✅ SSL/TLS for all connections
- ✅ Secrets Manager for sensitive data
- ✅ S3 server-side encryption

### Application Security
- ✅ WAF for production (SQL injection, XSS protection)
- ✅ Rate limiting
- ✅ CloudFront for DDoS protection
- ✅ Docker image vulnerability scanning

## 📈 Monitoring & Observability

### CloudWatch Metrics
- ECS CPU/Memory utilization
- RDS performance metrics
- ALB request/response metrics
- Custom application metrics

### CloudWatch Alarms (Production)
- **Critical**:
  - ECS CPU > 90% for 5 minutes
  - RDS CPU > 85% for 5 minutes
  - ALB 5xx errors > 10 in 1 minute
  - RDS storage < 10% free
- **Warning**:
  - ECS memory > 80% for 5 minutes
  - API latency > 2 seconds (p99)

### Logging
- ECS container logs to CloudWatch
- VPC Flow Logs (production)
- ALB access logs
- CloudTrail for API audit logging

## 💰 Cost Breakdown

| Service | Dev | Staging | Production |
|---------|-----|---------|------------|
| ECS Fargate | $10 | $30 | $150 |
| RDS PostgreSQL | $15 | $50 | $200 |
| S3 + CloudFront | $5 | $10 | $50 |
| ALB | $20 | $20 | $40 |
| NAT Gateway | $30 | $30 | $60 |
| Data Transfer | $5 | $10 | $50 |
| CloudWatch | $5 | $10 | $30 |
| **Total** | **$90** | **$160** | **$580** |

## 🔄 CI/CD Pipeline Flow

### Development
```
Push to develop → Run Tests → Build Docker Image →
Push to ECR → Deploy to ECS → Deploy Frontend to S3 → ✅ Done
```

### Staging
```
Push to staging → Run Tests → Security Scan →
Build Docker Image → Await Approval → Deploy to ECS →
Deploy Frontend to S3 → Invalidate CloudFront →
Run Smoke Tests → ✅ Done
```

### Production
```
Create Tag (v*) → Run Full Test Suite → Security Scan →
Build Docker Image → Create DB Backup → Await Approval →
Blue/Green Deploy to ECS → Deploy Frontend to S3 →
Invalidate CloudFront → Run Smoke Tests →
✅ Success OR ⚠️ Auto Rollback
```

## 📝 Next Steps

### Immediate (Before First Deployment)
1. ✅ Review and customize environment variables in `.env.*.template`
2. ✅ Create AWS Secrets Manager secrets (see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md))
3. ✅ Configure GitHub repository secrets for CI/CD
4. ✅ Set up GitHub environment protection rules
5. ✅ Configure custom domain in Route 53 (optional)

### Short-term (First Week)
1. Deploy to development environment
2. Test application functionality
3. Configure CloudWatch dashboards
4. Set up SNS topics for alerts
5. Document runbooks for common operations

### Long-term (First Month)
1. Deploy to staging environment
2. Perform load testing
3. Fine-tune auto-scaling policies
4. Implement ElastiCache Redis for sessions (optional)
5. Set up cost alerts and budget monitoring
6. Deploy to production with initial users

## 🆘 Getting Help

### Documentation
- [AWS Architecture Details](./AWS_ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Terraform Modules](../terraform/modules/)

### Common Commands
```bash
# View ECS service status
aws ecs describe-services \
  --cluster bankapp-prod-cluster \
  --services bankapp-prod-service

# View logs
aws logs tail /ecs/bankapp-prod --follow

# Create database backup
aws rds create-db-snapshot \
  --db-instance-identifier bankapp-prod-db \
  --db-snapshot-identifier manual-backup-$(date +%Y%m%d)

# Rollback ECS deployment
aws ecs update-service \
  --cluster bankapp-prod-cluster \
  --service bankapp-prod-service \
  --task-definition bankapp-prod-task:<previous-version>
```

### Support Resources
- **AWS Support**: https://console.aws.amazon.com/support/
- **Terraform Docs**: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
- **GitHub Actions**: https://docs.github.com/en/actions

## ✅ Checklist

### Before First Deployment
- [ ] AWS CLI configured
- [ ] Terraform installed and initialized
- [ ] S3 bucket created for Terraform state
- [ ] DynamoDB table created for state locking
- [ ] AWS Secrets Manager secrets created
- [ ] GitHub repository secrets configured
- [ ] GitHub environment protection rules set
- [ ] Environment variables reviewed and customized
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate requested in ACM (if applicable)

### After Infrastructure Deployment
- [ ] Verify VPC and subnets created
- [ ] Verify ECS cluster and service running
- [ ] Verify RDS database accessible
- [ ] Verify ALB health checks passing
- [ ] Verify S3 bucket created for frontend
- [ ] Verify CloudFront distribution (staging/prod)
- [ ] Configure DNS records in Route 53
- [ ] Set up CloudWatch alarms
- [ ] Test application end-to-end
- [ ] Document any custom configurations

### Production Readiness
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Backup and restore tested
- [ ] Disaster recovery plan documented
- [ ] Monitoring and alerting configured
- [ ] Runbooks created for common operations
- [ ] On-call rotation established
- [ ] Incident response plan documented
- [ ] Cost monitoring and budgets set
- [ ] Compliance requirements verified

---

## 📞 Contact

**Project**: BankApp
**Maintained By**: DevOps Team
**Last Updated**: January 2026

For questions or issues, please create an issue in the GitHub repository.
