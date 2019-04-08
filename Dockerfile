FROM ubuntu:latest

WORKDIR /app

COPY . .
RUN apt get update && apt-get install -y curl && apt-get install -y gnupg
RUN curl -sL https://deb.nodesource.com/setup.10.x | bash
RUN apt-get install -y nodejs
RUN npm install
EXPOSE 5000
ENV API_URL http://localhost:3001
CMD npm start

