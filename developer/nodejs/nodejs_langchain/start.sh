# sudo is needed because sometimes the graphics card have no access in current user
# this depends on your docker installation but for the sake of simplicity we can just run it as root via sudo
# keep in mind that the docker containers run via sudo will not appear on your docker desktop but it is running you can check it via docker ps
sudo docker compose up -d
