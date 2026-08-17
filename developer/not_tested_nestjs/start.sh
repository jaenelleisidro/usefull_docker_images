# https://medium.com/@svetlintanyi/easily-deploy-nestjs-with-docker-d85796f898a4
docker buildx create --name multiplatform --use
docker buildx build --platform linux/amd64,linux/arm64 -t account/image-name:tag --push .
