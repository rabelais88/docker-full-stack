FROM node:12.9.0-alpine
RUN mkdir /home/node/app -p
WORKDIR /home/node/app
COPY ./package.json ./yarn.lock ./
RUN yarn install
COPY . .
RUN apk --no-cache add curl
EXPOSE 4000:4000
CMD /wait && node server.js