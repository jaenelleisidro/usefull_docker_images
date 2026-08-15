# Create a local S3 bucket
resource "aws_s3_bucket" "test_bucket" {
  bucket = "my-local-simulation-bucket"
}

# Create a local DynamoDB table
resource "aws_dynamodb_table" "test_table" {
  name         = "my-local-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }
}
