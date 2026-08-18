# https://medium.com/@toluhunterdev/docker-aws-lambda-express-app-that-refuses-to-die-fc441de23c3e
docker build -t express-lambda . 
docker run -p 3000:3000 express-lambda