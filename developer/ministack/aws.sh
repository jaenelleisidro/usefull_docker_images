aws s3 mb s3://my-local-bucket \
  --endpoint-url http://localhost:4566 \
  --region us-east-1

aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions AttributeName=Id,AttributeType=S \
  --key-schema AttributeName=Id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:4566