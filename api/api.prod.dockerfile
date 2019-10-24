FROM node:12.9.0-alpine
RUN mkdir /home/node/app -p
WORKDIR /home/node/app
COPY ./package.json ./yarn.lock ./
RUN yarn install
COPY . .
RUN apk --no-cache add curl
EXPOSE 4000:4000
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait
CMD /wait && node server.js