terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 bucket for audio uploads
resource "aws_s3_bucket" "audio_uploads" {
  bucket = var.bucket_name
}

# Enable versioning
resource "aws_s3_bucket_versioning" "audio_uploads" {
  bucket = aws_s3_bucket.audio_uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Configure CORS
resource "aws_s3_bucket_cors_configuration" "audio_uploads" {
  bucket = aws_s3_bucket.audio_uploads.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = [var.frontend_url]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Create IAM user for app
resource "aws_iam_user" "app_user" {
  name = "nicely-app-user"
}

# Create access keys for the IAM user
resource "aws_iam_access_key" "app_user" {
  user = aws_iam_user.app_user.name
}

# S3 bucket policy
resource "aws_iam_user_policy" "app_user_policy" {
  name = "nicely-app-policy"
  user = aws_iam_user.app_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Resource = [
          aws_s3_bucket.audio_uploads.arn,
          "${aws_s3_bucket.audio_uploads.arn}/*"
        ]
      }
    ]
  })
}
