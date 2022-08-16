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

    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }
}


# providers config

provider "aws" {
  region = "eu-central-1"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
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

variable "lambda_runtime" {
  type = string
  validation {
    condition     = length(var.lambda_runtime) > 0
    error_message = "Lambda runtime is missing"
  }

  default = "nodejs16.x"
}

variable "project_tags" {
  type = object({
    env       = string
    customer  = string
    project   = string
    component = string
    managedBy = string
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
    condition     = length(var.project_tags.component) > 0
    error_message = "Component tag is missing."
  }

  validation {
    condition     = length(var.project_tags.managedBy) > 0
    error_message = "ManagedBy tag is missing."
  }
}

# locals

locals {
  full_project_name = "${var.project_prefix}-${var.project_name}-${var.env}"
}


# import resources for read

data "aws_route53_zone" "app" {
  name         = var.zone
  private_zone = false
}

# manage resources

resource "aws_route53_record" "app" {
  allow_overwrite = true
  zone_id         = data.aws_route53_zone.app.zone_id
  name            = aws_apigatewayv2_domain_name.api_gw.domain_name
  type            = "A"
  alias {
    name                   = aws_apigatewayv2_domain_name.api_gw.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api_gw.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = true
  }

  depends_on = [
    aws_apigatewayv2_domain_name.api_gw
  ]
}

resource "aws_acm_certificate" "cert" {
  //provider          = aws.us-east-1
  domain_name       = "${var.subdomain}.${var.zone}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = var.project_tags
}

resource "aws_acm_certificate_validation" "cert" {
  //provider                = aws.us-east-1
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
  zone_id         = data.aws_route53_zone.app.zone_id
}

# app code

resource "random_pet" "lambda_bucket_name" {
  prefix = local.full_project_name
  length = 2
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = random_pet.lambda_bucket_name.id
  force_destroy = true

  tags = var.project_tags
}

resource "aws_s3_bucket_acl" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}


data "archive_file" "app" {
  type = "zip"

  source_dir  = "${path.module}/../../api/dist"
  output_path = "${path.module}/app.zip"
}


data "archive_file" "node_modules" {
  type = "zip"

  source_dir  = "${path.module}/../../api/layers/node_modules"
  output_path = "${path.module}/node_modules.zip"
}


resource "aws_s3_bucket_object" "app" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "app.zip"
  source = data.archive_file.app.output_path

  etag = filemd5(data.archive_file.app.output_path)
}

resource "aws_s3_bucket_object" "node_modules" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "node_modules.zip"
  source = data.archive_file.node_modules.output_path

  etag = filemd5(data.archive_file.node_modules.output_path)
}

# lambda 

resource "aws_lambda_layer_version" "node_modules" {
  layer_name = "${local.full_project_name}_node_modules"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_bucket_object.node_modules.key

  compatible_runtimes = [var.lambda_runtime]
}

resource "aws_lambda_function" "app" {
  function_name = local.full_project_name

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_bucket_object.app.key

  layers = [aws_lambda_layer_version.node_modules.arn]

  runtime = var.lambda_runtime
  handler = "lambda.handler"

  source_code_hash = data.archive_file.app.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn

  tags = var.project_tags
}


resource "aws_cloudwatch_log_group" "app" {
  name = "/aws/lambda/${aws_lambda_function.app.function_name}"

  retention_in_days = 30
}

data "aws_iam_policy_document" "lambda_policy" {
  version = "2012-10-17"
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name               = "serverless_lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# gateway

resource "aws_apigatewayv2_api" "lambda" {
  name          = "${local.full_project_name}_gw"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = "production"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "app" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.app.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "app" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.app.id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.app.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

resource "aws_apigatewayv2_domain_name" "api_gw" {
  domain_name = "${var.subdomain}.${var.zone}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.cert.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  depends_on = [
    aws_acm_certificate.cert,
    aws_acm_certificate_validation.cert
  ]
}

resource "aws_apigatewayv2_api_mapping" "api_gw" {
  api_id      = aws_apigatewayv2_api.lambda.id
  domain_name = aws_apigatewayv2_domain_name.api_gw.id
  stage       = aws_apigatewayv2_stage.lambda.id
}