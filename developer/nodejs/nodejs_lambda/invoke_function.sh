# Basic invocation
serverless invoke local --function hello

# Invocation passing mock event data
serverless invoke local -f hello --data '{"test": "value"}'
