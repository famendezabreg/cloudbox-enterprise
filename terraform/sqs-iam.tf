resource "aws_iam_role_policy" "producer_sqs_policy" {
  name = "producer-sqs-policy"
  role = module.iam.lambda_role_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage"
        ]
        Resource = aws_sqs_queue.documents_queue.arn
      }
    ]
  })
}

resource "aws_iam_role_policy" "consumer_sqs_policy" {
  name = "consumer-sqs-policy"
  role = module.iam.lambda_role_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = aws_sqs_queue.documents_queue.arn
      }
    ]
  })
}