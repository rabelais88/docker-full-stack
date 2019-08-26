FROM node:12.9.0-alpine
RUN apk add --no-cache tini
RUN mkdir /homde/node/app -p
WORKDIR /home/node/app
COPY api/package.json api/yarn.lock ./
RUN yarn install
COPY api/. .
EXPOSE 4000:4000
ENTRYPOINT ["/sbin/tini", "--"]
CMD node server.js