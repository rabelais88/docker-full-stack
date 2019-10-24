# full stack docker node.js app example with SSL

## what I've learned in this
- `nginx/proxy` has its own quirks, such as:
  - creating internal network may cause upstream error
  - gzip should be added separately
- ~~but really, `nginx/proxy` is simpler than using `traefik` or other reverse-proxy apps. because it has tons of documents online.~~ `traefik` is ALWAYS RECOMMENDED for orchestration. maybe not so much for performance, but for the ease of deployment.
- *dockerize* and *healthcheck* is trickier than expectation. and maybe not really necessary in some cases. if the app handles error alright, it is not necessary.
- apps should implement its own healthcheck feature. using `curl` is not really a recommended option for health checking.
- any app settings should be provided via environment values, not files.
- version 2.0 of `traefik` provies better document than the previous ones.
- ACME let's encrypt has [rate limit](https://letsencrypt.org/docs/rate-limits/). use [stage url](https://letsencrypt.org/docs/staging-environment/) for avoiding rate limit for development.
- IMO, write development *docker-compose* file in `docker-swarm` style, not `docker-compose` style for development; the differences between two cause headache when writing production *docker-compose* file.
- when setting up `traefik`, here are what to consider:
  - if `traefik.yaml` is missing, `traefik` doesn't show any logs.
  - both *http* and *https* host info should be provided for both(in `services.${APP}.deploy.labels`)
  - all apps are interconnected w/o additional settings in `docker-swarm`. ports should be opened only for debugging purposes.(except `traefik` listening port)
  - use `docker container logs ${container name}` for container logs, `docker stack ps ${APP_NAME} --no-trunc` for service logs. both provides different logs, so be aware.
  - use backtick (&#96;) instead of ordinary single quote(') in `services.${APP}.deploy.labels`. *GoLang* has problem with reading single quoted strings.
  - `traefik` service must be designated as manager node
  - `driver:overlay` network is used for reaching separate nodes on different network: it may be not necessary, but can be used for scaling up in the future; use it if possible.

```sh
# development
sh build-dev.sh
docker stack deploy -c docker-compose.dev.yml test-app

# production
sh build-prod.sh
docker stack deploy -c docker-compose.prod.yml test-app
```