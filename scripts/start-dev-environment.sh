#!/bin/bash

# Start AWS Dev Environment
# This script starts the ECS service and RDS database

set -e

ENVIRONMENT="dev"
REGION="us-east-1"
CLUSTER_NAME="bankapp-${ENVIRONMENT}"
SERVICE_NAME="bankapp-${ENVIRONMENT}-service"
DB_IDENTIFIER="bankapp-${ENVIRONMENT}"

echo "🚀 Starting Dev Environment..."
echo ""

# Check RDS status first
echo "1️⃣ Checking RDS Database status..."
RDS_STATUS=$(aws rds describe-db-instances \
  --db-instance-identifier "$DB_IDENTIFIER" \
  --region "$REGION" \
  --query 'DBInstances[0].DBInstanceStatus' \
  --output text)

echo "Current RDS status: $RDS_STATUS"

if [ "$RDS_STATUS" = "stopping" ]; then
  echo "⏳ RDS is currently stopping. Waiting for it to fully stop..."
  while [ "$RDS_STATUS" = "stopping" ]; do
    sleep 10
    RDS_STATUS=$(aws rds describe-db-instances \
      --db-instance-identifier "$DB_IDENTIFIER" \
      --region "$REGION" \
      --query 'DBInstances[0].DBInstanceStatus' \
      --output text)
    echo "   Status: $RDS_STATUS"
  done
  echo "✅ RDS has stopped"
fi

if [ "$RDS_STATUS" = "stopped" ] || [ "$RDS_STATUS" = "stopping" ]; then
  echo "🚀 Starting RDS Database..."
  aws rds start-db-instance \
    --db-instance-identifier "$DB_IDENTIFIER" \
    --region "$REGION" \
    --no-cli-pager > /dev/null
  echo "✅ RDS database starting (this may take 2-5 minutes)"
elif [ "$RDS_STATUS" = "available" ]; then
  echo "✅ RDS database is already running"
else
  echo "⚠️  RDS is in status: $RDS_STATUS (will continue anyway)"
fi
echo ""

# Wait for RDS to be available
echo "⏳ Waiting for RDS to become available..."
aws rds wait db-instance-available \
  --db-instance-identifier "$DB_IDENTIFIER" \
  --region "$REGION"

echo "✅ RDS database is now available"
echo ""

# Start ECS Service
echo "2️⃣ Starting ECS Service..."
aws ecs update-service \
  --cluster "$CLUSTER_NAME" \
  --service "$SERVICE_NAME" \
  --desired-count 1 \
  --region "$REGION" \
  --no-cli-pager

echo "✅ ECS service started"
echo ""

echo "✅ Dev environment started successfully!"
echo ""
echo "🌐 Frontend: https://d7mq5w0ntx5im.cloudfront.net"
echo "🔗 API: http://bankapp-dev-alb-553282173.us-east-1.elb.amazonaws.com"
echo ""
echo "⏳ Wait 1-2 minutes for the ECS task to become healthy"
