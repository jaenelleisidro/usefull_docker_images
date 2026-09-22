# https://medium.com/@rashid14713524/how-to-containerize-a-go-api-using-docker-c7d9bdc9fd0f
docker build -t go-crud .
docker run \
  --name go-crud \
  -p 8080:8080 \
  -e PORT=8080 \
  -e DB_URL="postgres://postgres:test101@host.docker.internal:5432" \
  go-crud