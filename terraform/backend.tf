terraform {
  backend "s3" {
    bucket         = "cloudbox-terraform-state-famendez2026"
    key            = "cloudbox-enterprise/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}