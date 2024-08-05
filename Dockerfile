FROM node:20.10-alpine

WORKDIR /app

#ARG NODE_ENV=production
COPY ./package*.json ./
RUN npm install
COPY ./routes routes/
COPY ./views views/
COPY ./models models/
COPY ./public public/
COPY ./middleware middleware/
COPY ./index.js ./

CMD [ "npm", "run", "server" ]