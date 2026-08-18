# Run the container on port 3000
docker build -t nestjs_basic:latest .
docker run -d -p 3000:80 --name nest-app my-nest-app:latest