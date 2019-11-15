# full stack docker node.js app example with SSL

## what I've learned in this(these are not on Google)
- `nginx/proxy` has its own quirks, such as:
  - creating internal network may cause upstream error
  - gzip settings should be added separately in `vhost.d/${URL}`
- ~~but really, `nginx/proxy` is simpler than using `traefik` or other reverse-proxy apps. because it has tons of documents online.~~ `traefik` is ALWAYS RECOMMENDED for orchestration. maybe not so much for performance, but for the ease of deployment. it supports advanced orchestration features.
- *dockerize* and *healthcheck* is trickier than expectation. and maybe not really necessary in some cases. if the app handles error alright, it is not necessary.
- apps should implement its own healthcheck feature. using `curl` is not really a recommended option for health checking.
- any app settings should be provided via environment values, not files.
- version 2.0 of `traefik` provies better document than the previous ones.
- ACME let's encrypt has [rate limit](https://letsencrypt.org/docs/rate-limits/). use [stage url](https://letsencrypt.org/docs/staging-environment/) for avoiding rate limit for development.
- IMO, write development *docker-compose* file in `docker-swarm/docker-stack` style, not `docker-compose` style for development; the differences between two cause headache when writing production *docker-compose* file.
- when setting up `traefik`, here are what to consider:
  - if `traefik.yaml` is missing, `traefik` doesn't show any logs: really critical althrough nobody mentions it.
  - *http* and *https* host info should be provided for separately in `services.${APP}.deploy.labels`
  - all apps are interconnected w/o additional settings in `docker-swarm`. ports should be opened only for debugging purposes.(except `traefik` listening port) opening up unnecessary ports will make feasible attack vectors.
  - use `docker container logs ${container name}` for container logs, `docker service ps ${APP_NAME} --no-trunc` for service logs. both provides different logs, don't miss any one of them.
  - use backtick (&#96;) instead of ordinary single quote(') in `services.${APP}.deploy.labels`. *GoLang* has problem with reading single quoted strings.
  - `traefik` service must be designated as *swarm manager node*.
  - `driver:overlay` network is used for reaching separate nodes on different network. it may be not necessary, but can be used for scaling up in the future.
- it's always safer to provide secrets in files rather than using environment variables, as everything is wrapped inside container. environment variables can leak to other containers in certain situations. be aware of it.
- check volume when db authentication doesn't work. the authentcation data is created in the pilot run.
- any volumes that are not *bind-mount* are PERSISTENT! check volumes in any moment if anything is not working correctly. human consciousness is the weakest part of this automation.
- notes on `node.js`:
  - `services.${APP}.secrets` arbitrarily inserts CRLF(carriage returns) when converting secret into a docker secret file. remove it via regex.
- notes on `HTTPS` implementation:
  - [notes on HTTPS challenge types](https://letsencrypt.org/docs/challenge-types/)
  - [more notes on HTTPS challenge types](https://medium.com/@decrocksam/deploying-lets-encrypt-certificates-using-tls-alpn-01-https-18b9b1e05edf)
    - `TLS-SNI-01`: has been disabled in March 2019. DO NOT USE.
    - `DNS-01`: must provide DNS API secrets. can be dangerous when the server is attacked. ADVISABLE TO NOT TO USE.
    - `TLS-ALPN-01` : traefik must be reachable via port 443. uses temporary certificates. [official docs on TLS-ALPN challenge](https://docs.traefik.io/user-guides/docker-compose/acme-tls/)
    - `HTTP-01`: traefik must be reachable via port 80. can't use wildcard domain. some providers block port 80. uses temporary file serving. [official docs on HTTPS challenge](https://docs.traefik.io/user-guides/docker-compose/acme-http/)
- run [a temporary image](https://hub.docker.com/r/bretfisher/httpenv) before running on real web domain, to make sure the future work process is not hindered.
- check `letsencrypt` json file in order to see if `HTTPS` challenge is successful.
- check if port `:443` is mixed with `:433`.
- don't use *redirect middleware*. use [HTTPS redirection header](https://docs.traefik.io/middlewares/headers/#using-security-headers). redirect middleware may not work in certain cases.
- [the note on middleware](https://docs.traefik.io/middlewares/overview/) says `xxxx@file` suffix works for external files, but doesn't mention which files. the default `.yaml` or `.toml` is is not considered as `@docker` or `@file`. to make things simpler, just use `.deploy.labels` + `xxxx@docker`.

## 내가 배운 것들(대부분 구글에서 찾을 수 없는 것들)
- `nginx/proxy` 사용시 특이사항:
  - *internal network*을 만들면 *upstream error*를 발생시킨다.(`traefik`과 반대)
  - gzip 설정은 `vhost.d/${URL}` 디렉토리를 통하여 제공해야한다.
- 여러 강좌 및 용례를 통하여 봤을 때, 극단적인 사례를 제외하고 항상 `traefik`을 사용하는 쪽이 오케스트레이션에 용이하다. 퍼포먼스로는 조금 뒤쳐질지 모르나, 설정이 매우 편리하고 오케스트레이션만을 위한 최적화와 추가기능이 구비되어 있다. 최소 수십 명 이상의 대규모 개발진이 아닌 이상은 고려할만 하다.
- *dockerize*구현이나 *healthcheck*는 생각보다 설정이 어렵다. 그리고 꼭 필요하다고 보기도 어렵다. 만약 에러가 없다면 당장은 필요하지 않을지도 모른다.
- 앱은 직접 *healthcheck* 기능을 구현하고 있어야 한다. 그렇지 않으면 `curl`을 직접 설치해야되고 이는 이미지 용량에도 부담이 되며, 단순 url 핑 체크 이외의 기능을 구현하기가 까다로워진다.
- 모든 설정은 파일이 아니라 환경변수를 통하여 제공되어야 한다. 그래야 오케스트레이션에서 한눈에 보고 설정하기 편하다.
- `traefik` 버전 2.0 문서가 1.0보다 훨씬 낫다. LTS버전도 10월부터 2.0으로 올라갔다.
- ACME let's encrypt는 [인증 횟수 제한](https://letsencrypt.org/docs/rate-limits/)이 있으므로 [stage url](https://letsencrypt.org/docs/staging-environment/)에서 개발하고 로그에 문제가 없으면 버전을 올리자. 오케스트레이션을 통하여 자동인증을 받게 될 경우 기본세팅에 따라 대부분 인증이 성공할때까지 연속시도를 하게 되기 때문에, 금방 횟수 제한에 걸려 블락을 먹게 되기 때문이다. 블락을 먹게 될 경우 blacklist되었다는 내용이 메시지로 전달되므로 로그를 유심히 보자.
- 개인적인 의견이지만, 개발 단계에서부터 `docker-swarm/docker-stack` 형식으로 개발하는 편이 `docker-compose`로 작성하고 나중에 양식을 변경하는 것보다 쉽다. 그리고 `traefik` 에서 두 가지를 다루는 방식이 꽤 다르기 때문에 나중에 골치가 아프다.
- `traefik` 사용시 특이사항:
  - `traefik.yaml`이 없을 경우 로그가 아예 남지 않는다. 아무도 언급하지 않지만 제일 중요한 사항.
  - *http* 와 *https* 용 `deploy.labels` 세팅은 각각 별도로 제공되어야 한다.
  - `docker-swarm`에서는 별도로 포트를 열지 않아도 모든 컨테이너의 포트가 서로 통신할 수 있다. `docker-compose` 파일에서 포트를 여는 것은 내부로 포트를 여는 것이 아니라 외부로 포트를 연다는 뜻이다. 포트는 디버그를 위해서 여는 것이고 불필요하게 포트를 열면 보안 취약점이 된다.
  - `docker container logs ${container name}`으로 컨테이너 로그를 확인하고, `docker service ps ${APP_NAME} --no-trunc`로 서비스 로그를 확인한다. 각기 다른 로그를 제공하므로 둘다 놓치지 않고 확인해야한다.
  - *GoLang*이 작은따옴표를 제대로 파싱하지 못하기 때문에 작은따옴표(') 대신 백틱(&#96;)을 사용해야 한다.
  - `traefik`용 서비스는 *manager node*로 지정해야 한다.
  - `driver:overlay`는 다른 네트워크에 있는 별도 노드에 접속하기 위해서 사용한다. 단일 노드일때에는 별로 중요하지 않은데, 후일 스케일업을 위해서 넣는 편이 좋다.
- 암호는 항상 파일로 전달하는 편이 환경 변수로 전달하는 것보다 안전하다. 왜냐하면 파일과 달리 environment variable은 다른 컨테이너로 노출될 수 있기 때문이다. 따라서 여러 이미지를 굴리다보면 의도하지 않게 보안 취약점을 만들게 될 수 있다.
- db 인증이 되지 않는다면 볼륨을 확인하여 삭제하자. 첫 실행에서 아이디와 비밀번호가 생성되는 것이 보통 관례이다. 휘발성 있는 k8의 볼륨과 달리 docker-swarm의 볼륨은 항상 유지되므로 주의하자.
- db 로그인시 인코딩에 주의하자! 또는 `stdout`과 파일, 환경변수가 각각 모두 다른 인코딩을 가지고 있을 수 있음에 주의하자!
- `node.js` 주의점:
  - 도커 시크릿은 입력값이 파일로 변환되면서 줄바꿈이 임의로 삽입된다. 줄바꿈을 항상 제거하고 시크릿 값을 사용하자
- `HTTPS` 보안 구현:
  - [HTTPS challenge 종류 설명](https://letsencrypt.org/docs/challenge-types/)
  - [HTTPS challenge 종류 설명 2](https://medium.com/@decrocksam/deploying-lets-encrypt-certificates-using-tls-alpn-01-https-18b9b1e05edf)
    - `TLS-SNI-01`: 2019년 3월에 종료(deprecated). *사용하지 말 것*.
    - `DNS-01`: DNS API 암호키를 제공하여야 한다. 하지만 서버가 공격받을 경우 DNS에 등록된 개인정보까지 털릴 수 있어서 극도로 위험하다. *가능하면 이용하지 말 것.*
    - `TLS-ALPN-01` : traefik이 443포트로 접근이 가능해야 한다. 임시 인증서를 발급하여 이를 DNS로 확인하는 challenge 방식. [official docs on TLS-ALPN challenge](https://docs.traefik.io/user-guides/docker-compose/acme-tls/)
    - `HTTP-01`: traefik이 80포트로 접근이 가능해야 한다. 와일드카드 서브도메인(`*.xxxx.xxx`)을 사용할 수 없다. 일부 프로바이더들은 80포트를 안전상의 이유로 막아놓기도 한다. 임시 파일을 호스팅하여 이를 DNS로 확인하는 방식. [official docs on HTTPS challenge](https://docs.traefik.io/user-guides/docker-compose/acme-http/)
- 템플릿을 서빙하는 [임시 이미지](https://hub.docker.com/r/bretfisher/httpenv)를 실제 웹 도메인에 먼저 올려서 나중의 인증작업에서 시간을 더 낭비하지 않도록 하자.
- `letsencrypt` json file 을 확인하여 `HTTPS` 성공 여부를 확인 가능하다.
- `:443`포트와 `:433` 포트를 헷갈리는 경우가 간혹 있다. 주의하자.
- *redirect middleware*를 사용하지 말고 [HTTPS redirection header](https://docs.traefik.io/middlewares/headers/#using-security-headers) 를 사용하자. 특정 경우에서 *redirect middleware*가 이상하게도 동작하지 않는 경우가 있었다.
- [middleware에 대한 traefik 공식 문서](https://docs.traefik.io/middlewares/overview/)에 따르면 `xxx@file` 이 외부 설정파일에 사용된다고만 하지 정확히 어디까지가 외부파일인지 명확하게 밝혀놓지 않았다. 기본 `.yaml` 이나 `.toml` 은 `@docker` 도 아니고 `@file` 도 아니다. 설정을 좀더 간단하게 하고 싶다면 `.deploy.labels` + `xxxx@docker` 를 결합하여 사용하는 쪽이 낫다.

## test/deployment
```sh
# development
sh build-dev.sh
docker stack deploy -c docker-compose.dev.yml test-app

# production
# creating secret
echo "${MONGO_USERNAME}" | docker secret create testapp-mongo-username -
echo "${MONGO_PASSWORD}" | docker secret create testapp-mongo-password -
sh build-prod.sh
docker stack deploy -c docker-compose.prod.yml test-app
```

## supplement
- testing mongo user
```sh
mongo admin --username $USERNAME --password $PASSWORD
```
