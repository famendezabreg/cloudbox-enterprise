module "dynamodb" {
  source = "./modules/dynamodb"
}

module "cognito" {
  source = "./modules/cognito"
}

module "iam" {
  source = "./modules/iam"
}

module "lambda" {
  source          = "./modules/lambda"
  lambda_role_arn = module.iam.lambda_role_arn
  queue_url       = aws_sqs_queue.documents_queue.id
}

module "apigateway" {
  source                       = "./modules/apigateway"
  user_pool_arn                = module.cognito.user_pool_arn
  create_file_invoke_arn       = module.lambda.create_file_invoke_arn
  get_files_invoke_arn         = module.lambda.get_files_invoke_arn
  get_file_by_id_invoke_arn    = module.lambda.get_file_by_id_invoke_arn
  update_file_invoke_arn       = module.lambda.update_file_invoke_arn
  delete_file_invoke_arn       = module.lambda.delete_file_invoke_arn
  create_file_function_name    = module.lambda.create_file_function_name
  get_files_function_name      = module.lambda.get_files_function_name
  get_file_by_id_function_name = module.lambda.get_file_by_id_function_name
  update_file_function_name    = module.lambda.update_file_function_name
  delete_file_function_name    = module.lambda.delete_file_function_name
}


# Laboratorio 10 CI/CD
