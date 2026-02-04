variable "project_name" {
  description = "Application name"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "cloudfront_oai_iam_arn" {
  default     = ""
  description = "IAM ARN of the CloudFront Origin Access Identity"
  type        = string
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}
