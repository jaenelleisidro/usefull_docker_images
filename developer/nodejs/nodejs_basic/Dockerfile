FROM node:lts-alpine3.18

WORKDIR /app

COPY package.json .

RUN npm install

#needed for production
COPY . ./

ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "run", "dev"]
