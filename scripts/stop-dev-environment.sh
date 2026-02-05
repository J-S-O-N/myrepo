#!/bin/bash

# Stop AWS Dev Environment
# This script stops the ECS service and RDS database to save costs

set -e

ENVIRONMENT="dev"
REGION="us-east-1"
CLUSTER_NAME="bankapp-${ENVIRONMENT}"
SERVICE_NAME="bankapp-${ENVIRONMENT}-service"
DB_IDENTIFIER="bankapp-${ENVIRONMENT}"

echo "🛑 Stopping Dev Environment..."
echo ""

# Stop ECS Service
echo "1️⃣ Stopping ECS Service..."
aws ecs update-service \
  --cluster "$CLUSTER_NAME" \
  --service "$SERVICE_NAME" \
  --desired-count 0 \
  --region "$REGION" \
  --no-cli-pager

echo "✅ ECS service tasks set to 0"
echo ""

# Stop RDS Database
echo "2️⃣ Stopping RDS Database..."
aws rds stop-db-instance \
  --db-instance-identifier "$DB_IDENTIFIER" \
  --region "$REGION" \
  --no-cli-pager

echo "✅ RDS database stopping (will auto-restart in 7 days)"
echo ""

echo "✅ Dev environment stopped successfully!"
echo ""
echo "💰 Cost savings: ~$20-35/month while stopped"
echo ""
echo "⚠️  Note: RDS will automatically restart after 7 days"
echo "    Run this script again if needed after 7 days"
echo ""
echo "🚀 To restart: ./scripts/start-dev-environment.sh"
