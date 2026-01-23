# Development Environment Configuration
# Simplified starter configuration - Phase 1: VPC and ECR only

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "bankapp-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "BankApp"
      Environment = "dev"
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"

  environment  = "dev"
  project_name = "bankapp"
  vpc_cidr     = "10.0.0.0/16"
}

# ECR Module
module "ecr" {
  source = "../../modules/ecr"

  environment  = "dev"
  project_name = "bankapp"
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.ecr.repository_url
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnet_ids
}
