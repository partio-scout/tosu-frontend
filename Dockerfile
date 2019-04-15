FROM ubuntu:latest

WORKDIR /app
COPY ./src ./src
COPY ./public ./public
COPY ./package.json ./package.json
RUN apt-get update && apt-get install -y curl && apt-get install -y gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install -y nodejs
RUN npm install --production && npm install -g serve && npm run build
EXPOSE 3000
ENV API_URL http://backend:3001
CMD serve -s build -p 3000

