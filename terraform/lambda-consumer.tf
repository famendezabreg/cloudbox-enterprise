data "archive_file" "consumer_zip" {
  type        = "zip"
  source_dir  = "${path.root}/backend/consumer"
  output_path = "${path.root}/backend/consumer.zip"
}

resource "aws_lambda_function" "consumer" {
  filename         = data.archive_file.consumer_zip.output_path
  source_code_hash = data.archive_file.consumer_zip.output_base64sha256
  function_name    = "documents-consumer"
  role             = module.iam.lambda_role_arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 10

  environment {
    variables = {
      TABLE_NAME = module.dynamodb.table_name
    }
  }
}
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.documents_queue.arn
  function_name    = aws_lambda_function.consumer.arn
  batch_size       = 1
}
