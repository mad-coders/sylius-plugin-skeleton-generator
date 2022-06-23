terraform {
  required_providers {
    aws = {
      region  = "eu-central-1"
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  resource "aws_s3_bucket" "ngstatic" {
    bucket = "sylius-plugin-skel-gen-ng01-prod"

    tags = {
        Name        = "Sylius Plugin Skeleton Generator - Angular webhosting"
        Environment = "Production"
    }
  }
}