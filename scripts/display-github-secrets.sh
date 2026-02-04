#!/bin/bash
# Script to display GitHub Actions secrets for manual configuration
# This displays the secrets in your terminal so you can copy them to GitHub

set -e

echo "=============================================="
echo "GitHub Actions Secrets Configuration"
echo "=============================================="
echo ""
echo "Go to: https://github.com/Jonathan-Singh/myrepo/settings/secrets/actions"
echo "Click 'New repository secret' for each entry below"
echo ""
echo "=============================================="
echo ""

# Get AWS credentials
AWS_ACCESS_KEY_ID=$(grep -A 1 "\[default\]" ~/.aws/credentials | grep "aws_access_key_id" | cut -d'=' -f2 | tr -d ' ')
AWS_SECRET_ACCESS_KEY=$(grep -A 2 "\[default\]" ~/.aws/credentials | grep "aws_secret_access_key" | cut -d'=' -f2 | tr -d ' ')

# AWS Credentials
echo "1. AWS_ACCESS_KEY_ID_DEV"
echo "   Value: $AWS_ACCESS_KEY_ID"
echo ""

echo "2. AWS_SECRET_ACCESS_KEY_DEV"
echo "   Value: $AWS_SECRET_ACCESS_KEY"
echo ""

# AWS Configuration
echo "3. AWS_REGION"
echo "   Value: us-east-1"
echo ""

echo "4. AWS_ACCOUNT_ID"
echo "   Value: 454016835436"
echo ""

# ECR Configuration
echo "5. ECR_REPOSITORY"
echo "   Value: bankapp-dev"
echo ""

# ECS Configuration
echo "6. ECS_CLUSTER"
echo "   Value: bankapp-dev"
echo ""

echo "7. ECS_SERVICE"
echo "   Value: bankapp-dev-service"
echo ""

# S3 Configuration
echo "8. S3_BUCKET"
echo "   Value: bankapp-dev-frontend"
echo ""

# Database Configuration
echo "9. DB_HOST"
echo "   Value: bankapp-dev.c1geou8m5wm9.us-east-1.rds.amazonaws.com"
echo ""

echo "10. DB_PORT"
echo "   Value: 5432"
echo ""

echo "11. DB_NAME"
echo "   Value: testaiapp"
echo ""

echo "12. DB_USER"
echo "   Value: postgres"
echo ""

echo "13. DB_PASSWORD"
echo "   Value: xAxRdctU5#}+i]IvY\$u=_Dsz&EdZ>BA2"
echo ""

# Application Configuration
echo "14. JWT_SECRET"
echo "   Value: b+NxH+z3pSd8hlp4TrDbzBmkH81cZkDJ6PXqk5k/3Bc="
echo ""

echo "15. NODE_ENV"
echo "   Value: development"
echo ""

echo "=============================================="
echo "After adding all secrets, verify at:"
echo "https://github.com/Jonathan-Singh/myrepo/settings/secrets/actions"
echo ""
echo "Then trigger deployment:"
echo "https://github.com/Jonathan-Singh/myrepo/actions/workflows/deploy-dev.yml"
echo "=============================================="
