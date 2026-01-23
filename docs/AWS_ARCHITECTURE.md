# AWS Architecture - BankApp

## Architecture Overview

This document outlines the well-architected AWS infrastructure for the BankApp project across three environments: Development, Staging, and Production.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Route 53 (DNS)                          │
│                    bankapp.example.com                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CloudFront (CDN)                              │
│              - SSL/TLS Termination                              │
│              - DDoS Protection                                  │
│              - Edge Caching                                     │
└───────────┬─────────────────────────┬───────────────────────────┘
            │                         │
            ▼                         ▼
┌───────────────────────┐   ┌───────────────────────────────────┐
│    S3 Bucket          │   │   Application Load Balancer       │
│  (Static Frontend)    │   │        (Backend API)              │
│   - React Build       │   │    - Health Checks                │
│   - Vite Assets       │   │    - SSL Termination              │
└───────────────────────┘   └─────────────┬─────────────────────┘
                                          │
                            ┌─────────────┴─────────────┐
                            │                           │
                            ▼                           ▼
                ┌───────────────────────┐   ┌───────────────────────┐
                │   ECS Fargate         │   │   ECS Fargate         │
                │   (Backend API)       │   │   (Backend API)       │
                │   - Express Server    │   │   - Express Server    │
                │   - Auto Scaling      │   │   - Auto Scaling      │
                └──────────┬────────────┘   └──────────┬────────────┘
                           │                           │
                           └───────────┬───────────────┘
                                       │
                                       ▼
                           ┌───────────────────────┐
                           │   RDS PostgreSQL      │
                           │   - Multi-AZ          │
                           │   - Automated Backups │
                           │   - Read Replicas     │
                           └───────────────────────┘
```

## AWS Services Used

### 1. **Compute Layer**
- **AWS ECS Fargate**: Serverless container orchestration for Node.js backend
  - Auto-scaling based on CPU/Memory
  - No EC2 instance management
  - Cost-effective for variable workloads

### 2. **Storage Layer**
- **Amazon S3**: Static website hosting for React frontend
  - Versioning enabled
  - Lifecycle policies for old versions
  - Server-side encryption (SSE-S3)
- **Amazon RDS PostgreSQL**: Managed relational database
  - Multi-AZ deployment (Staging/Prod)
  - Automated daily backups (35-day retention)
  - Automated minor version upgrades
  - Read replicas for production

### 3. **Networking Layer**
- **Amazon VPC**: Isolated network environment
  - Public subnets (2 AZs) for ALB
  - Private subnets (2 AZs) for ECS/RDS
  - NAT Gateways for outbound internet access
- **Application Load Balancer**: HTTP/HTTPS traffic distribution
  - SSL/TLS termination with ACM certificates
  - Health checks for ECS tasks
  - Sticky sessions support

### 4. **Content Delivery**
- **Amazon CloudFront**: Global CDN
  - Edge caching for static assets
  - Custom domain support
  - AWS WAF integration for security
  - Origin failover support

### 5. **Security & Compliance**
- **AWS Secrets Manager**: Secure credential storage
  - JWT secrets
  - Database passwords
  - API keys (Yahoo Finance, CoinGecko)
  - Automatic rotation support
- **AWS Certificate Manager (ACM)**: SSL/TLS certificates
  - Free SSL certificates
  - Automatic renewal
- **AWS WAF**: Web Application Firewall
  - SQL injection protection
  - XSS protection
  - Rate limiting
- **Security Groups**: Network-level firewall rules
  - Least privilege access
  - Layer-specific security

### 6. **Monitoring & Logging**
- **Amazon CloudWatch**: Metrics and logs
  - Application logs from ECS
  - RDS performance metrics
  - Custom metrics (API latency, error rates)
  - Alarms for critical metrics
- **AWS X-Ray**: Distributed tracing (optional)
  - API performance analysis
  - Bottleneck identification

### 7. **CI/CD Pipeline**
- **GitHub Actions**: Build and deployment automation
  - Separate workflows for dev/staging/prod
  - Docker image building
  - Infrastructure deployment
- **Amazon ECR**: Docker container registry
  - Private repositories per environment
  - Image scanning for vulnerabilities
  - Lifecycle policies for old images

### 8. **Additional Services**
- **Amazon Route 53**: DNS management
  - Health checks and failover
  - Geolocation routing (optional)
- **AWS Systems Manager Parameter Store**: Configuration management
  - Environment variables
  - Feature flags
- **AWS CloudTrail**: Audit logging
  - API call tracking
  - Compliance requirements

## Environment Specifications

### Development Environment
- **Purpose**: Developer testing and integration
- **Infrastructure**:
  - ECS Fargate: 0.25 vCPU, 512 MB RAM (1 task)
  - RDS: db.t3.micro (single AZ)
  - S3: Standard storage class
  - CloudFront: Disabled (direct S3 access)
- **Cost**: ~$30-50/month
- **Deployment**: Auto-deploy on push to `develop` branch

### Staging Environment
- **Purpose**: Pre-production validation and QA testing
- **Infrastructure**:
  - ECS Fargate: 0.5 vCPU, 1 GB RAM (2 tasks)
  - RDS: db.t3.small (Multi-AZ)
  - S3: Standard storage class
  - CloudFront: Enabled with SSL
- **Cost**: ~$100-150/month
- **Deployment**: Manual approval required after develop passes

### Production Environment
- **Purpose**: Live customer-facing application
- **Infrastructure**:
  - ECS Fargate: 1 vCPU, 2 GB RAM (3-10 tasks with auto-scaling)
  - RDS: db.t3.medium (Multi-AZ with read replica)
  - S3: Standard + Intelligent-Tiering
  - CloudFront: Enabled with WAF
  - CloudWatch: Enhanced monitoring
- **Cost**: ~$300-500/month (varies with traffic)
- **Deployment**: Manual approval required, blue/green deployment

## Network Architecture

### VPC Configuration (Per Environment)

```
VPC: 10.0.0.0/16 (Development)
     10.1.0.0/16 (Staging)
     10.2.0.0/16 (Production)

┌─────────────────────────────────────────────────────────┐
│                    Availability Zone A                  │
│                                                          │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │  Public Subnet   │  │    Private Subnet           │ │
│  │  10.X.1.0/24     │  │    10.X.11.0/24             │ │
│  │                  │  │                             │ │
│  │  - NAT Gateway   │  │  - ECS Tasks                │ │
│  │  - ALB           │  │  - RDS Primary              │ │
│  └──────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Availability Zone B                  │
│                                                          │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │  Public Subnet   │  │    Private Subnet           │ │
│  │  10.X.2.0/24     │  │    10.X.12.0/24             │ │
│  │                  │  │                             │ │
│  │  - NAT Gateway   │  │  - ECS Tasks                │ │
│  │  - ALB           │  │  - RDS Standby              │ │
│  └──────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Security Architecture

### IAM Roles & Policies

1. **ECS Task Execution Role**
   - Pull images from ECR
   - Write logs to CloudWatch
   - Read secrets from Secrets Manager

2. **ECS Task Role**
   - Access S3 for file operations
   - Access RDS via security groups
   - Send metrics to CloudWatch

3. **CI/CD Pipeline Role**
   - Deploy to ECS
   - Push images to ECR
   - Update CloudFormation/Terraform stacks

### Security Groups

```
ALB Security Group:
  Inbound:
    - Port 443 (HTTPS) from 0.0.0.0/0
    - Port 80 (HTTP) from 0.0.0.0/0 (redirect to 443)
  Outbound:
    - Port 3001 to ECS Security Group

ECS Security Group:
  Inbound:
    - Port 3001 from ALB Security Group
  Outbound:
    - Port 5432 to RDS Security Group
    - Port 443 to 0.0.0.0/0 (for external APIs)

RDS Security Group:
  Inbound:
    - Port 5432 from ECS Security Group
  Outbound:
    - None
```

## Disaster Recovery & High Availability

### Backup Strategy
- **RDS Automated Backups**: Daily snapshots, 35-day retention
- **RDS Manual Snapshots**: Before major deployments
- **S3 Versioning**: Enabled for all buckets
- **Database Point-in-Time Recovery**: 5-minute RPO

### High Availability
- **Multi-AZ Deployment**: RDS failover < 2 minutes
- **Auto-Scaling**: ECS tasks scale based on CPU (target 70%)
- **Health Checks**: ALB health checks every 30 seconds
- **CloudFront Failover**: Automatic origin failover

### Recovery Time Objectives (RTO)
- **Development**: 4 hours
- **Staging**: 2 hours
- **Production**: 30 minutes

### Recovery Point Objectives (RPO)
- **Development**: 24 hours
- **Staging**: 1 hour
- **Production**: 5 minutes

## Cost Optimization

### Strategies
1. **Auto-Scaling**: Scale down during off-peak hours
2. **Reserved Instances**: RDS Reserved Instances for production (1-year)
3. **S3 Lifecycle**: Move old objects to Glacier after 90 days
4. **CloudFront**: Cache static assets at edge (reduce origin requests)
5. **Spot Instances**: Consider Fargate Spot for dev/staging (70% cost savings)
6. **Right-Sizing**: Monitor and adjust instance sizes quarterly

### Estimated Monthly Costs

| Service | Development | Staging | Production |
|---------|-------------|---------|------------|
| ECS Fargate | $10 | $30 | $150 |
| RDS PostgreSQL | $15 | $50 | $200 |
| S3 + CloudFront | $5 | $10 | $50 |
| ALB | $20 | $20 | $40 |
| NAT Gateway | $30 | $30 | $60 |
| Data Transfer | $5 | $10 | $50 |
| CloudWatch | $5 | $10 | $30 |
| **Total** | **~$90** | **~$160** | **~$580** |

*Note: Actual costs vary based on traffic and usage patterns*

## Compliance & Governance

### AWS Well-Architected Framework

1. **Operational Excellence**
   - Infrastructure as Code (Terraform)
   - Automated deployments
   - CloudWatch monitoring and alarms

2. **Security**
   - Encryption at rest (RDS, S3)
   - Encryption in transit (TLS 1.2+)
   - Secrets Manager for credentials
   - WAF for application protection

3. **Reliability**
   - Multi-AZ deployments
   - Auto-scaling and self-healing
   - Automated backups

4. **Performance Efficiency**
   - CloudFront CDN
   - ECS Fargate auto-scaling
   - RDS read replicas

5. **Cost Optimization**
   - Right-sizing resources
   - Auto-scaling based on demand
   - Lifecycle policies

## Scaling Strategy

### Horizontal Scaling (ECS)
```yaml
Development:
  Min Tasks: 1
  Max Tasks: 2
  Target CPU: 80%

Staging:
  Min Tasks: 2
  Max Tasks: 4
  Target CPU: 70%

Production:
  Min Tasks: 3
  Max Tasks: 10
  Target CPU: 70%
  Scale-up: Add 1 task when CPU > 70% for 2 minutes
  Scale-down: Remove 1 task when CPU < 30% for 5 minutes
```

### Database Scaling
- **Vertical**: Increase RDS instance size during peak seasons
- **Horizontal**: Add read replicas for read-heavy workloads
- **Caching**: Implement ElastiCache Redis for session storage (future)

## Monitoring & Alerting

### CloudWatch Alarms

**Critical (Production)**
- ECS CPU > 90% for 5 minutes
- RDS CPU > 85% for 5 minutes
- ALB 5xx errors > 10 in 1 minute
- RDS storage < 10% free

**Warning (Production)**
- ECS memory > 80% for 5 minutes
- API latency > 2 seconds (p99)
- Failed health checks > 2 consecutive

### Dashboards
- Real-time application metrics
- Database performance metrics
- Cost and usage metrics
- Security metrics (WAF blocks, failed logins)

## Next Steps

1. Review and approve architecture design
2. Set up AWS accounts (dev, staging, prod) or use AWS Organizations
3. Configure GitHub repository secrets for AWS credentials
4. Deploy infrastructure using Terraform
5. Configure CI/CD pipelines
6. Perform security review
7. Load testing and performance optimization
8. Documentation and runbook creation
