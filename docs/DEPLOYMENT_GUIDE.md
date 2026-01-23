# BankApp AWS Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial AWS Setup](#initial-aws-setup)
3. [Infrastructure Deployment](#infrastructure-deployment)
4. [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)
5. [Environment-Specific Deployment](#environment-specific-deployment)
6. [Monitoring and Operations](#monitoring-and-operations)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Tools
- **AWS CLI** v2.x or later ([Install](https://aws.amazon.com/cli/))
- **Terraform** v1.0 or later ([Install](https://www.terraform.io/downloads))
- **Docker** v20.x or later ([Install](https://docs.docker.com/get-docker/))
- **Node.js** v18.x ([Install](https://nodejs.org/))
- **Git** v2.x or later

### AWS Account Requirements
- AWS account with administrative access
- AWS CLI configured with appropriate credentials
- Sufficient service limits for:
  - VPC (3 VPCs minimum)
  - ECS Fargate (15+ concurrent tasks)
  - RDS (3 PostgreSQL instances)
  - ALB (3 load balancers)

### Cost Estimate
- **Development**: ~$90/month
- **Staging**: ~$160/month
- **Production**: ~$580/month
- **Total**: ~$830/month

---

## Initial AWS Setup

### Step 1: Configure AWS CLI

```bash
# Configure AWS credentials
aws configure

# Verify configuration
aws sts get-caller-identity

# Expected output:
# {
#     "UserId": "AIDACKCEVSQ6C2EXAMPLE",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/your-username"
# }
```

### Step 2: Create S3 Bucket for Terraform State

```bash
# Create S3 bucket for Terraform state (one-time setup)
aws s3 mb s3://bankapp-terraform-state --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket bankapp-terraform-state \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket bankapp-terraform-state \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Step 3: Create AWS Secrets Manager Secrets

```bash
# Development secrets
aws secretsmanager create-secret \
  --name bankapp/dev/jwt-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region us-east-1

# Staging secrets
aws secretsmanager create-secret \
  --name bankapp/staging/jwt-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region us-east-1

aws secretsmanager create-secret \
  --name bankapp/staging/db-password \
  --secret-string "$(openssl rand -base64 24)" \
  --region us-east-1

# Production secrets (CRITICAL - Use strong passwords)
aws secretsmanager create-secret \
  --name bankapp/prod/jwt-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region us-east-1

aws secretsmanager create-secret \
  --name bankapp/prod/db-password \
  --secret-string "$(openssl rand -base64 24)" \
  --region us-east-1

aws secretsmanager create-secret \
  --name bankapp/prod/session-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region us-east-1
```

---

## Infrastructure Deployment

### Development Environment

```bash
# Navigate to Terraform directory
cd terraform

# Initialize Terraform (first time only)
terraform init

# Create development workspace
terraform workspace new dev
terraform workspace select dev

# Review planned changes
terraform plan \
  -var="environment=dev" \
  -var="aws_region=us-east-1"

# Apply infrastructure
terraform apply \
  -var="environment=dev" \
  -var="aws_region=us-east-1" \
  -auto-approve

# Save outputs
terraform output -json > ../outputs/dev-outputs.json
```

### Staging Environment

```bash
# Create staging workspace
terraform workspace new staging
terraform workspace select staging

# Review planned changes
terraform plan \
  -var="environment=staging" \
  -var="aws_region=us-east-1"

# Apply infrastructure (requires approval)
terraform apply \
  -var="environment=staging" \
  -var="aws_region=us-east-1"

# Save outputs
terraform output -json > ../outputs/staging-outputs.json
```

### Production Environment

```bash
# Create production workspace
terraform workspace new prod
terraform workspace select prod

# Review planned changes
terraform plan \
  -var="environment=prod" \
  -var="aws_region=us-east-1"

# Apply infrastructure (requires manual approval and review)
terraform apply \
  -var="environment=prod" \
  -var="aws_region=us-east-1"

# Save outputs
terraform output -json > ../outputs/prod-outputs.json
```

---

## CI/CD Pipeline Configuration

### Step 1: Configure GitHub Repository Secrets

Navigate to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

#### Development Secrets
```
AWS_ACCESS_KEY_ID_DEV=<your-dev-access-key>
AWS_SECRET_ACCESS_KEY_DEV=<your-dev-secret-key>
```

#### Staging Secrets
```
AWS_ACCESS_KEY_ID_STAGING=<your-staging-access-key>
AWS_SECRET_ACCESS_KEY_STAGING=<your-staging-secret-key>
CLOUDFRONT_DISTRIBUTION_ID_STAGING=<cloudfront-id>
```

#### Production Secrets
```
AWS_ACCESS_KEY_ID_PROD=<your-prod-access-key>
AWS_SECRET_ACCESS_KEY_PROD=<your-prod-secret-key>
CLOUDFRONT_DISTRIBUTION_ID_PROD=<cloudfront-id>
```

### Step 2: Create IAM Users for GitHub Actions

```bash
# Create IAM user for CI/CD
aws iam create-user --user-name github-actions-bankapp-dev
aws iam create-user --user-name github-actions-bankapp-staging
aws iam create-user --user-name github-actions-bankapp-prod

# Attach policies (use least privilege - create custom policy)
aws iam attach-user-policy \
  --user-name github-actions-bankapp-prod \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

aws iam attach-user-policy \
  --user-name github-actions-bankapp-prod \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

# Create access keys
aws iam create-access-key --user-name github-actions-bankapp-dev
aws iam create-access-key --user-name github-actions-bankapp-staging
aws iam create-access-key --user-name github-actions-bankapp-prod
```

### Step 3: Configure GitHub Environments

1. Go to **Settings → Environments**
2. Create environments:
   - `development` (auto-deploy)
   - `staging-approval` (require reviewers)
   - `staging` (auto-deploy after approval)
   - `production-approval` (require reviewers)
   - `production` (auto-deploy after approval)

3. For `staging-approval` and `production-approval`:
   - Enable "Required reviewers"
   - Add team members who can approve deployments
   - Enable "Prevent self-review" (optional)

### Step 4: Trigger Initial Deployment

```bash
# Development - Push to develop branch
git checkout -b develop
git push origin develop

# Staging - Push to staging branch
git checkout -b staging
git push origin staging

# Production - Create a tag
git checkout main
git tag v1.0.0
git push origin v1.0.0
```

---

## Environment-Specific Deployment

### Manual Deployment (if needed)

#### Deploy Backend to ECS

```bash
# Build Docker image
docker build -t bankapp-backend:latest .

# Tag for ECR
docker tag bankapp-backend:latest \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/bankapp-prod:latest

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Push image
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/bankapp-prod:latest

# Update ECS service
aws ecs update-service \
  --cluster bankapp-prod-cluster \
  --service bankapp-prod-service \
  --force-new-deployment
```

#### Deploy Frontend to S3

```bash
# Build frontend
cd TestAiApp
npm ci
npm run build

# Deploy to S3
aws s3 sync dist/ s3://bankapp-prod-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

---

## Monitoring and Operations

### View ECS Service Status

```bash
# Check service status
aws ecs describe-services \
  --cluster bankapp-prod-cluster \
  --services bankapp-prod-service

# View running tasks
aws ecs list-tasks \
  --cluster bankapp-prod-cluster \
  --service-name bankapp-prod-service

# View logs
aws logs tail /ecs/bankapp-prod --follow
```

### Database Operations

```bash
# Connect to RDS via SSH tunnel (if needed)
ssh -i your-key.pem -L 5432:your-rds-endpoint:5432 ec2-user@bastion-host

# Create database backup
aws rds create-db-snapshot \
  --db-instance-identifier bankapp-prod-db \
  --db-snapshot-identifier bankapp-manual-backup-$(date +%Y%m%d)

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier bankapp-prod-db-restored \
  --db-snapshot-identifier bankapp-manual-backup-20260123
```

### CloudWatch Monitoring

```bash
# View recent logs
aws logs tail /ecs/bankapp-prod --since 1h

# Get metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=bankapp-prod-service \
  --start-time 2026-01-23T00:00:00Z \
  --end-time 2026-01-23T23:59:59Z \
  --period 3600 \
  --statistics Average
```

---

## Troubleshooting

### Common Issues

#### 1. ECS Tasks Failing to Start

```bash
# Check task definition
aws ecs describe-task-definition --task-definition bankapp-prod-task

# View stopped tasks
aws ecs list-tasks \
  --cluster bankapp-prod-cluster \
  --desired-status STOPPED

# Get task failure reason
aws ecs describe-tasks \
  --cluster bankapp-prod-cluster \
  --tasks <task-arn>
```

#### 2. Database Connection Issues

```bash
# Verify security group rules
aws ec2 describe-security-groups --group-ids <sg-id>

# Test connection from ECS task
aws ecs execute-command \
  --cluster bankapp-prod-cluster \
  --task <task-id> \
  --container bankapp-backend \
  --interactive \
  --command "/bin/sh"

# Inside container:
nc -zv <db-endpoint> 5432
```

#### 3. High CPU/Memory Usage

```bash
# Check CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name MemoryUtilization \
  --dimensions Name=ServiceName,Value=bankapp-prod-service \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum

# Scale up tasks temporarily
aws ecs update-service \
  --cluster bankapp-prod-cluster \
  --service bankapp-prod-service \
  --desired-count 5
```

---

## Rollback Procedures

### Rollback ECS Deployment

```bash
# List recent task definitions
aws ecs list-task-definitions \
  --family-prefix bankapp-prod-task \
  --sort DESC

# Update service to previous task definition
aws ecs update-service \
  --cluster bankapp-prod-cluster \
  --service bankapp-prod-service \
  --task-definition bankapp-prod-task:12  # Previous version
```

### Rollback Database

```bash
# List available snapshots
aws rds describe-db-snapshots \
  --db-instance-identifier bankapp-prod-db

# Restore from snapshot (creates new instance)
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier bankapp-prod-db-rollback \
  --db-snapshot-identifier bankapp-prod-pre-deploy-20260123

# Update application to use rollback instance
# (requires DNS/config update)
```

### Rollback Frontend

```bash
# S3 versioning allows quick rollback
aws s3api list-object-versions \
  --bucket bankapp-prod-frontend \
  --prefix index.html

# Restore specific version
aws s3api copy-object \
  --bucket bankapp-prod-frontend \
  --copy-source bankapp-prod-frontend/index.html?versionId=<version-id> \
  --key index.html

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

---

## Best Practices

### Security
1. ✅ Use AWS Secrets Manager for all sensitive data
2. ✅ Enable MFA for production AWS access
3. ✅ Regularly rotate credentials and secrets
4. ✅ Enable CloudTrail for audit logging
5. ✅ Use least privilege IAM policies

### Deployment
1. ✅ Always test in dev/staging before production
2. ✅ Create database backups before deployments
3. ✅ Use blue/green deployments for production
4. ✅ Monitor deployments for at least 15 minutes post-deployment
5. ✅ Have rollback plan ready before deployment

### Cost Optimization
1. ✅ Use Fargate Spot for dev/staging (70% savings)
2. ✅ Schedule auto-scaling to scale down during off-hours
3. ✅ Use RDS Reserved Instances for production
4. ✅ Enable S3 lifecycle policies
5. ✅ Review and delete unused resources monthly

---

## Support and Escalation

### Monitoring Contacts
- **CloudWatch Alarms**: Configured to send to SNS topic
- **Critical Issues**: Page on-call engineer
- **Non-Critical**: Create ticket in issue tracker

### Runbook Links
- [Database Maintenance](./runbooks/database-maintenance.md)
- [Scaling Procedures](./runbooks/scaling.md)
- [Incident Response](./runbooks/incident-response.md)

---

## Additional Resources

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)
- [RDS Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)
- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

---

**Last Updated**: January 2026
**Maintained By**: DevOps Team
