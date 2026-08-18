# https://oneuptime.com/blog/post/2026-02-08-how-to-containerize-a-nestjs-application-with-docker/view

docker compose --env-file .env.local  -f docker-compose.local.yml up -d --wait
npm run start:local