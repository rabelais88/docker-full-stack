# full stack docker node.js app example with SSL

# caveat
- `nginx/proxy` has its own quirks, such as:
  - creating internal network may cause upstream error
  - gzip should be added separately
- but really, `nginx/proxy` is simpler than using `traefik` or other reverse-proxy apps. because it has tons of documents online.
- *dockerize* and *healthcheck* is trickier than expectation. and maybe not really necessary in some cases. if the app handles error alright, it is not necessary.
- apps should implement its own healthcheck feature. using `curl` is not really a recommended option for health checking.
- version 2.0 of `traefik` provies better document than the previous ones. but it lacks some crucial info about migration.
- ACME let's encrypt has [rate limit](https://letsencrypt.org/docs/rate-limits/). use [stage url](https://letsencrypt.org/docs/staging-environment/) for avoiding rate limit for development.

# local test
```bash
. ./init-cert-dev.sh
. ./build-n-stage.sh
. ./stop-n-clean.sh
```

# production deploy
```bash
. ./init-cert-prod.sh
docker stack deploy -c compose.prod.test.yml ${stack name} # nginx
docker stack deploy -c compose.prod.traefik.yml ${stack name} # traefik
docker stack rm ${service name}
```

# helpful links
- https://github.com/jwilder/nginx-proxy
- https://github.com/jwilder/nginx-proxy#ssl-support-using-letsencrypt
- https://github.com/jwilder/nginx-proxy/issues/1132
- https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion/issues/102
- https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion/blob/master/docs/Invalid-authorizations.md
- https://docs.traefik.io/v2.0/


# unsolved error messages
## traefik
```
docker-full-stack_traefik.1.yywpoj0qhxuq@sungryeol    | time="2019-08-28T08:03:59Z" level=error msg="Unable to obtain ACME certificate for domains \"sungryeol.xyz,sungryeol.xyz,www.sungryeol.xyz,api.sungryeol.xyz\" : unable to generate a certificate for the domains [sungryeol.xyz sungryeol.xyz www.sungryeol.xyz api.sungryeol.xyz]: acme: Error -> One or more domains had a problem:\n[www.sungryeol.xyz] acme: error: 400 :: urn:ietf:params:acme:error:connection :: Fetching http://www.sungryeol.xyz/.well-known/acme-challenge/VFQ-vUT3wBaDH9v71RWk8HH76j-iduJpMoyVbRN8YjY: Timeout during connect (likely firewall problem), url: \n"
```
## nginx
```
docker-full-stack_nginx-letsencrypt.1.l0k20jzsf3ss@sungryeol    | Location: https://acme-v01.api.letsencrypt.org/acme/reg/64416723
...

docker-full-stack_nginx-letsencrypt.1.l0k20jzsf3ss@sungryeol    | {
docker-full-stack_nginx-letsencrypt.1.l0k20jzsf3ss@sungryeol    |   "type": "urn:acme:error:malformed",
docker-full-stack_nginx-letsencrypt.1.l0k20jzsf3ss@sungryeol    |   "detail": "Registration key is already in use",
docker-full-stack_nginx-letsencrypt.1.l0k20jzsf3ss@sungryeol    |   "status": 409
docker-full-stack_nginx-letsencrypt.1.l0k20jzsf3ss@sungryeol    | }
```
> maybe it hit the rate limit?? as it used the non-staging url