# GitHub Actions Secrets Configuration

This guide explains how to configure GitHub Actions secrets for automatic deployment to AWS.

## Option 1: Using GitHub CLI (Automated)

### Install GitHub CLI

```bash
# macOS
brew install gh

# Login to GitHub
gh auth login
```

### Run the Setup Script

```bash
./scripts/setup-github-secrets.sh
```

The script will prompt you for your AWS credentials and automatically configure all other secrets.

## Option 2: Manual Configuration via GitHub Web UI

Go to: https://github.com/Jonathan-Singh/myrepo/settings/secrets/actions

Click "New repository secret" and add each of the following:

### AWS Credentials

| Secret Name | Value | Notes |
|------------|-------|-------|
| `AWS_ACCESS_KEY_ID_DEV` | Your AWS Access Key | Get from AWS IAM Console |
| `AWS_SECRET_ACCESS_KEY_DEV` | Your AWS Secret Key | Get from AWS IAM Console |
| `AWS_REGION` | `us-east-1` | Fixed value |
| `AWS_ACCOUNT_ID` | `454016835436` | Fixed value |

### AWS Resources

| Secret Name | Value | Notes |
|------------|-------|-------|
| `ECR_REPOSITORY` | `bankapp-dev` | ECR repository name |
| `ECS_CLUSTER` | `bankapp-dev` | ECS cluster name |
| `ECS_SERVICE` | `bankapp-dev-service` | ECS service name |
| `S3_BUCKET` | `bankapp-dev-frontend` | S3 bucket for frontend |

### Database Configuration

| Secret Name | Value | Notes |
|------------|-------|-------|
| `DB_HOST` | `bankapp-dev.c1geou8m5wm9.us-east-1.rds.amazonaws.com` | RDS endpoint |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `testaiapp` | Database name |
| `DB_USER` | `postgres` | Database username |
| `DB_PASSWORD` | `xAxRdctU5#}+i]IvY$u=_Dsz&EdZ>BA2` | Database password |

### Application Configuration

| Secret Name | Value | Notes |
|------------|-------|-------|
| `JWT_SECRET` | `b+NxH+z3pSd8hlp4TrDbzBmkH81cZkDJ6PXqk5k/3Bc=` | JWT signing secret |
| `NODE_ENV` | `development` | Node environment |

## Getting AWS Credentials

### Option 1: Create New IAM User (Recommended)

1. Go to AWS IAM Console: https://console.aws.amazon.com/iam/
2. Click "Users" → "Create user"
3. Username: `github-actions-bankapp-dev`
4. Select "Attach policies directly"
5. Add these policies:
   - `AmazonEC2ContainerRegistryPowerUser`
   - `AmazonECS_FullAccess`
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess` (if using CloudFront)
6. Create user
7. Go to "Security credentials" tab
8. Click "Create access key"
9. Select "Application running outside AWS"
10. Copy Access Key ID and Secret Access Key

### Option 2: Use Existing User Credentials

If you already have AWS credentials configured locally:

```bash
# View your current AWS credentials
cat ~/.aws/credentials

# Or get from environment
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
```

## Verification

After adding all secrets, verify they're set:

```bash
# Using GitHub CLI
gh secret list --repo Jonathan-Singh/myrepo

# Or check in GitHub UI
# https://github.com/Jonathan-Singh/myrepo/settings/secrets/actions
```

## Testing the Deployment

Once secrets are configured:

1. Push code to the `develop` branch:
   ```bash
   git checkout develop
   git push origin develop
   ```

2. Monitor the deployment:
   - GitHub Actions: https://github.com/Jonathan-Singh/myrepo/actions
   - Or via CLI: `gh run list --repo Jonathan-Singh/myrepo`

3. Check deployment status:
   ```bash
   # View latest workflow run
   gh run view --repo Jonathan-Singh/myrepo

   # View logs
   gh run view --log --repo Jonathan-Singh/myrepo
   ```

## Endpoints After Deployment

- **Backend API**: http://bankapp-dev-alb-553282173.us-east-1.elb.amazonaws.com
- **Frontend S3**: http://bankapp-dev-frontend.s3-website-us-east-1.amazonaws.com
- **ECS Service**: https://console.aws.amazon.com/ecs/v2/clusters/bankapp-dev/services
- **RDS Database**: bankapp-dev.c1geou8m5wm9.us-east-1.rds.amazonaws.com:5432

## Troubleshooting

### Secret Not Found Error

Make sure the secret name matches exactly (case-sensitive). Check:
```bash
gh secret list --repo Jonathan-Singh/myrepo
```

### AWS Permission Denied

Verify the IAM user has the correct policies attached:
- ECR: Push images
- ECS: Update services
- S3: Upload objects
- CloudWatch: Read logs

### ECS Deployment Failed

Check ECS task logs:
```bash
aws ecs describe-tasks \
  --cluster bankapp-dev \
  --tasks $(aws ecs list-tasks --cluster bankapp-dev --service-name bankapp-dev-service --query 'taskArns[0]' --output text) \
  --region us-east-1
```

### Database Connection Failed

Verify RDS security group allows connections from ECS tasks:
```bash
aws rds describe-db-instances \
  --db-instance-identifier bankapp-dev \
  --region us-east-1
```

## Security Notes

- Never commit secrets to git
- Rotate credentials regularly
- Use least-privilege IAM policies
- Enable MFA for AWS IAM users
- Monitor CloudWatch for suspicious activity
- Database password is stored in AWS Secrets Manager

## Next Steps

After secrets are configured:

1. ✅ Secrets configured
2. ⏳ Update GitHub Actions workflow (uncomment ECS deployment steps)
3. ⏳ Push to develop branch
4. ⏳ Monitor deployment
5. ⏳ Test application endpoints
