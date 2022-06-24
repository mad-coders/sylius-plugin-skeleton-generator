terraform {

  # configure remote backend to s3
  # rest of configuration is contained in backend.{env}.hcl file
  backend "s3" {
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# providers config

provider "aws" {
    region  = "eu-central-1"
}

provider "aws" {
  region = "us-east-1"
  alias = "us-east-1"
}

# variables

variable "project_name" {
    type = string
    validation {
        condition     = length(var.project_name) > 0
        error_message = "Project name is missing."
    }
}

variable "project_prefix" {
    type = string
    validation {
        condition     = length(var.project_prefix) > 0
        error_message = "Project prefix is missing."
    }
}

variable "env" {
    type = string
    validation {
        condition     = length(var.env) > 0
        error_message = "Project env is missing."
    }
}

variable "zone" {
    type = string
    validation {
        condition     = length(var.zone) > 0
        error_message = "DNS ZONE is missing."
    }
}

variable "subdomain" {
    type = string
    validation {
        condition     = length(var.subdomain) > 0
        error_message = "DNS Subdomain is missing."
    }
}


variable "project_tags" {
  type = object({
    env = string
    customer    = string
    project     = string
    managedBy   = string
  })

  validation {
    condition     = length(var.project_tags.env) > 0
    error_message = "Environment tag is missing."
  }

  validation {
    condition     = length(var.project_tags.customer) > 0
    error_message = "Customer tag is missing."
  }

  validation {
    condition     = length(var.project_tags.project) > 0
    error_message = "Project tag is missing."
  }

  validation {
    condition     = length(var.project_tags.managedBy) > 0
    error_message = "ManagedBy tag is missing."
  }
}

# locals

locals {
    full_project_name = "${var.project_prefix}-${var.project_name}-${var.env}"
    ng_origin_id = "ngS3Origin"
}

# import resources for read

data "aws_route53_zone" "ngapp" {
  name         = "${var.zone}"
  private_zone = false
}

# manage resources

resource "aws_route53_record" "ngapp" {
  allow_overwrite = true
  zone_id         = data.aws_route53_zone.ngapp.zone_id
  name            = "${var.subdomain}.${var.zone}"
  type            = "A"
  alias {
    name = aws_cloudfront_distribution.ngapp.domain_name
    zone_id = aws_cloudfront_distribution.ngapp.hosted_zone_id
    evaluate_target_health = true
  }

  depends_on = [
    aws_cloudfront_distribution.ngapp
  ]
}

resource "aws_acm_certificate" "cert" {
  provider          = aws.us-east-1
  domain_name       = "${var.subdomain}.${var.zone}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = var.project_tags
}

resource "aws_acm_certificate_validation" "cert" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert : record.fqdn]
}

resource "aws_route53_record" "cert" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.ngapp.zone_id
}

resource "aws_s3_bucket" "ngapp" {
    bucket = "${local.full_project_name}"

    # this is deprecated but there are issues with static s3 webhosting when it is missing even though aws_s3_bucket_website_configuration is used
    # website {
    #     error_document = "error.html"
    #     index_document = "index.html"
    # }
    
    tags = var.project_tags
}

# resource "aws_s3_bucket_website_configuration" "ngapp" {
#     bucket = aws_s3_bucket.ngapp.bucket

#     index_document {
#         suffix = "index.html"
#     }

#     error_document {
#         key = "error.html"
#     }
# }

resource "aws_cloudfront_origin_access_identity" "ngapp" {
  comment = "Sylius plugin skeleton generator - Angular frontend OAI"
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.ngapp.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.ngapp.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "ngapp" {
  bucket = aws_s3_bucket.ngapp.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_cloudfront_distribution" "ngapp" {
    origin {
        domain_name = aws_s3_bucket.ngapp.bucket_regional_domain_name
        origin_id   = local.ng_origin_id
        s3_origin_config {
            origin_access_identity = aws_cloudfront_origin_access_identity.ngapp.cloudfront_access_identity_path
        }
    }

    enabled             = true
    is_ipv6_enabled     = true
    comment             = "Angular application"
    default_root_object = "index.html"
    aliases = ["${var.subdomain}.${var.zone}"]
    wait_for_deployment = false

    viewer_certificate {
        cloudfront_default_certificate = false
        ssl_support_method = "sni-only"
        acm_certificate_arn = aws_acm_certificate_validation.cert.certificate_arn
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    default_cache_behavior {
        allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
        cached_methods   = ["GET", "HEAD"]
        target_origin_id = local.ng_origin_id

        forwarded_values {
            query_string = false

            cookies {
                forward = "none"
            }
        }

        viewer_protocol_policy = "redirect-to-https"
        min_ttl                = 0
        default_ttl            = 30
        max_ttl                = 360
    }

    custom_error_response {
        error_code = 403
        response_code = 200
        response_page_path = "/index.html"
    }


    custom_error_response {
        error_code = 404
        response_code = 200
        response_page_path = "/index.html"
    }

    tags = var.project_tags
}

# output

output "frontend_bucket_name" {
    description = "Angular application - bucket name"
    value = aws_s3_bucket.ngapp.bucket
}

output "frontend_bucket_region" {
    description = "Angular application - bucket region"
    value = aws_s3_bucket.ngapp.region
}

output "frontend_cf_distribution_id" {
    description = "Angular application - CF distribution id"
    value = aws_cloudfront_distribution.ngapp.id
}