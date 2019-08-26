FROM node:12.9.0-stretch as dependency
RUN mkdir /node/myapp -p
COPY frontend/package.json frontend/yarn.lock /node/myapp/
WORKDIR /node/myapp
RUN yarn install --production=true
COPY frontend/public/. ./public/
COPY frontend/src/. ./src/
RUN yarn build

FROM node:12.9.0-alpine
RUN mkdir /node/myapp -p
WORKDIR /node/myapp
COPY --from=dependency /node/myapp/node_modules/. ./node_modules/
COPY --from=dependency /node/myapp/build/. ./build/
COPY --from=dependency /node/myapp/package.json /node/myapp/yarn.lock ./
EXPOSE 3000:3000
CMD node node_modules/.bin/http-server ./build -p 3000