i followed this tutorial
https://medium.com/@aamiralihussain53/store-logs-on-elk-stack-using-winston-and-nodejs-elasticsearch-kibana-f8bea51fc5b2


however i use nodejs_basic code in usefull_docker_images repo as starting point
and connected it to an elk stack container

I added
ELASTIC_HOST env
but instead of using
ELASTIC_HOST=http://localhost:9200
i used below
ELASTIC_HOST=http://host.docker.internal:9200

host.docker.internal << this refers to the host's localhost so it can access the elastic search on port 9200




you will need to run docker-elk and nodejs_basic_elk containers
check start.sh for both folders

docker-elk/reset.sh << resets passwords you will need to update all .env to reflect the updated values
docker-elk/restart.sh << once password resets and env updated, youll need to restart elk and restart nodejs_basic_elk seperately