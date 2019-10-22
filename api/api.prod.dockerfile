FROM node:12.9.0-alpine
# RUN apk add --no-cache tini
RUN mkdir /home/node/app -p
WORKDIR /home/node/app
COPY ./package.json ./yarn.lock ./
# COPY dockersettings/wait-for-it.sh ./
RUN yarn install
COPY . .
RUN apk --no-cache add curl
EXPOSE 4000:4000
# ENTRYPOINT ["/sbin/tini", "--"]
# CMD . ./wait-for-it.sh db:27017 -- node server.js # this doesn't work properly maybe because of ID and PASS?
CMD node server.js