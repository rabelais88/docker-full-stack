FROM node:12.9.0-stretch as dependency
RUN mkdir /node/myapp -p
COPY ./package.json ./yarn.lock /node/myapp/
WORKDIR /node/myapp
RUN yarn install

FROM node:12.9.0-alpine
RUN mkdir /node/myapp -p
COPY --from=dependency /node/myapp/. /node/myapp/
WORKDIR /node/myapp
EXPOSE 3000:3000
# env is added via compose.build.args
ENV REACT_APP_API_URL "https://api.127.0.0.1.xyz"
CMD node node_modules/.bin/react-scripts start