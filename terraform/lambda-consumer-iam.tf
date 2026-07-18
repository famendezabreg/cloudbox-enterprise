resource "aws_iam_role_policy" "consumer_dynamodb_policy" {
  name = "consumer-dynamodb-policy"
  role = module.iam.lambda_role_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem"
        ]
        Resource = module.dynamodb.table_arn
      }
    ]
  })
}