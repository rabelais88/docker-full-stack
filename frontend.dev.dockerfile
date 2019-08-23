FROM node:12.9.0-stretch as dependency
RUN mkdir /node/myapp -p
COPY frontend/package.json frontend/yarn.lock /node/myapp/
WORKDIR /node/myapp
RUN yarn install

FROM node:12.9.0-alpine
RUN mkdir /node/myapp -p
COPY --from=dependency /node/myapp/. /node/myapp/
WORKDIR /node/myapp
EXPOSE 3000:3000
CMD yarn start