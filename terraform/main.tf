# Main Terraform Configuration for BankApp
# This is the root module that calls environment-specific configurations

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration for state management
  # Uncomment and configure after creating S3 bucket for state
  # backend "s3" {
  #   bucket         = "bankapp-terraform-state"
  #   key            = "terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "BankApp"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "DevOps"
    }
  }
}

# Variables
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "bankapp"
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = module.alb.alb_dns_name
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "s3_bucket_name" {
  description = "S3 bucket for frontend"
  value       = module.s3.bucket_name
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.ecr.repository_url
}

# Module calls
module "vpc" {
  source = "./modules/vpc"

  environment  = var.environment
  project_name = var.project_name
  vpc_cidr     = lookup(var.vpc_cidrs, var.environment, "10.0.0.0/16")
}

module "ecr" {
  source = "./modules/ecr"

  environment  = var.environment
  project_name = var.project_name
}

module "rds" {
  source = "./modules/rds"

  environment            = var.environment
  project_name           = var.project_name
  vpc_id                 = module.vpc.vpc_id
  private_subnet_ids     = module.vpc.private_subnet_ids
  vpc_cidr            = module.vpc.vpc_cidr
  instance_class         = lookup(var.db_instance_classes, var.environment, "db.t3.micro")
}

module "alb" {
  source = "./modules/alb"

  environment        = var.environment
  project_name       = var.project_name
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
}

module "ecs" {
  source = "./modules/ecs"

  environment         = var.environment
  project_name        = var.project_name
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  target_group_arn     = module.alb.target_group_arn
  alb_listener_arn = module.alb.http_listener_arn
  alb_security_group_id = module.alb.alb_security_group_id
  ecr_repository_url  = module.ecr.repository_url
  task_cpu           = lookup(var.ecs_cpu, var.environment, "256")
  task_memory        = lookup(var.ecs_memory, var.environment, "512")
  desired_count       = lookup(var.ecs_desired_count, var.environment, 1)
}

module "s3" {
  source = "./modules/s3"

  environment  = var.environment
  project_name = var.project_name
}

module "cloudfront" {
  source = "./modules/cloudfront"
  count  = var.environment != "dev" ? 1 : 0

  environment    = var.environment
  project_name   = var.project_name
  s3_bucket_name = module.s3.bucket_name
  s3_bucket_regional_domain_name = module.s3.bucket_regional_domain_name
}

# Environment-specific variables
variable "vpc_cidrs" {
  description = "VPC CIDR blocks per environment"
  type        = map(string)
  default = {
    dev     = "10.0.0.0/16"
    staging = "10.1.0.0/16"
    prod    = "10.2.0.0/16"
  }
}

variable "db_instance_classes" {
  description = "RDS instance classes per environment"
  type        = map(string)
  default = {
    dev     = "db.t3.micro"
    staging = "db.t3.small"
    prod    = "db.t3.medium"
  }
}

variable "ecs_cpu" {
  description = "ECS task CPU per environment"
  type        = map(string)
  default = {
    dev     = "256"
    staging = "512"
    prod    = "1024"
  }
}

variable "ecs_memory" {
  description = "ECS task memory per environment"
  type        = map(string)
  default = {
    dev     = "512"
    staging = "1024"
    prod    = "2048"
  }
}

variable "ecs_desired_count" {
  description = "ECS desired task count per environment"
  type        = map(number)
  default = {
    dev     = 1
    staging = 2
    prod    = 3
  }
}
