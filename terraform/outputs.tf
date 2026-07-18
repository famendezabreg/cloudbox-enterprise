output "api_url" {
  value = module.apigateway.api_url
}

output "user_pool_id" {
  value = module.cognito.user_pool_id
}

output "app_client_id" {
  value = module.cognito.client_id
}

output "region" {
  value = var.aws_region
}

output "dynamodb_table" {
  value = "Files"
}

output "documents_queue_url" {
  value = aws_sqs_queue.documents_queue.id
}

output "documents_queue_arn" {
  value = aws_sqs_queue.documents_queue.arn
}
