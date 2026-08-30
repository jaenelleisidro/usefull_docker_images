import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";

// Override the endpoint
const s3 = new S3Client({
  endpoint: "http://localhost:4566",
  region: "us-east-1",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test"
  }
});

await s3.send(new CreateBucketCommand({ 
    Bucket: "my-test-bucket" 
}));
