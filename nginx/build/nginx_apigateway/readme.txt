docker network create example-net


if having error in cache 
https://www.codegrepper.com/code-examples/shell/how+to+clear+docker+build+cache

# Rebuild the image
docker build . --no-cache

# Pull the base images again and rebuild
docker build . --no-cache --pull

# Also works with docker-compose
docker-compose build --no-cache

# If nothing from the above works for you, you could also prune everything
docker system prune


to delete all container/image
docker container prune
docker image prune

rebuild
docker-compose build

run horizontal scaled
docker-compose up --scale node_service=5

scaling tutorial
https://pspdfkit.com/blog/2018/how-to-use-docker-compose-to-run-multiple-instances-of-a-service-in-development/
https://levelup.gitconnected.com/load-balance-and-scale-node-js-containers-with-nginx-and-docker-swarm-9fc97c3cff81

prod staging dev in docker
https://dev.to/erezhod/setting-up-a-nestjs-project-with-docker-for-back-end-development-30lg
