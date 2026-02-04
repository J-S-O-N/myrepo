#!/bin/bash
# Script to configure GitHub Actions secrets for BankApp development environment
# Requires: gh CLI tool (https://cli.github.com/)

set -e

REPO="Jonathan-Singh/myrepo"
JWT_SECRET="b+NxH+z3pSd8hlp4TrDbzBmkH81cZkDJ6PXqk5k/3Bc="
DB_PASSWORD="xAxRdctU5#}+i]IvY\$u=_Dsz&EdZ>BA2"

echo "🔐 Setting up GitHub Actions secrets for $REPO..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com/"
    echo ""
    echo "On macOS: brew install gh"
    echo "Then run: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Function to set a secret
set_secret() {
    local name=$1
    local value=$2
    echo "Setting secret: $name"
    echo "$value" | gh secret set "$name" --repo "$REPO"
}

# AWS Credentials
echo "📦 Setting AWS credentials..."
read -p "Enter AWS_ACCESS_KEY_ID_DEV: " AWS_ACCESS_KEY_ID_DEV
set_secret "AWS_ACCESS_KEY_ID_DEV" "$AWS_ACCESS_KEY_ID_DEV"

read -sp "Enter AWS_SECRET_ACCESS_KEY_DEV: " AWS_SECRET_ACCESS_KEY_DEV
echo ""
set_secret "AWS_SECRET_ACCESS_KEY_DEV" "$AWS_SECRET_ACCESS_KEY_DEV"

# AWS Configuration
echo ""
echo "📦 Setting AWS configuration..."
set_secret "AWS_REGION" "us-east-1"
set_secret "AWS_ACCOUNT_ID" "454016835436"

# ECR Configuration
echo ""
echo "📦 Setting ECR configuration..."
set_secret "ECR_REPOSITORY" "bankapp-dev"

# ECS Configuration
echo ""
echo "📦 Setting ECS configuration..."
set_secret "ECS_CLUSTER" "bankapp-dev"
set_secret "ECS_SERVICE" "bankapp-dev-service"

# S3 Configuration
echo ""
echo "📦 Setting S3 configuration..."
set_secret "S3_BUCKET" "bankapp-dev-frontend"

# Database Configuration
echo ""
echo "📦 Setting database configuration..."
set_secret "DB_HOST" "bankapp-dev.c1geou8m5wm9.us-east-1.rds.amazonaws.com"
set_secret "DB_PORT" "5432"
set_secret "DB_NAME" "testaiapp"
set_secret "DB_USER" "postgres"
set_secret "DB_PASSWORD" "$DB_PASSWORD"

# Application Configuration
echo ""
echo "📦 Setting application configuration..."
set_secret "JWT_SECRET" "$JWT_SECRET"
set_secret "NODE_ENV" "development"

echo ""
echo "✅ All secrets have been configured successfully!"
echo ""
echo "Next steps:"
echo "1. Push code to 'develop' branch to trigger deployment"
echo "2. Monitor deployment: gh run list --repo $REPO"
echo "3. View logs: gh run view --repo $REPO"
echo ""
echo "Application endpoints:"
echo "  Backend API: http://bankapp-dev-alb-553282173.us-east-1.elb.amazonaws.com"
echo "  Frontend S3: http://bankapp-dev-frontend.s3-website-us-east-1.amazonaws.com"
echo ""
