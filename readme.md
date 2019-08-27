# full stack docker node.js app example with SSL
everything in this app is self-explanatory. check the shell script files for info.

# caveat
- `nginx/proxy` has its own quirks, such as:
  - creating internal network may cause upstream error
  - gzip should be added separately
- but really, `nginx/proxy` is simpler than using `traefik` or other reverse-proxy apps. because it has tons of documents online.
- *dockerize* and *healthcheck* is trickier than expectation. and maybe not really necessary in some cases. if the app handles error alright, it is not necessary.
- apps should implement its own healthcheck feature. using `curl` is not really a recommended option for healthcehck.

# helpful links
- https://github.com/jwilder/nginx-proxy
- https://github.com/jwilder/nginx-proxy#ssl-support-using-letsencrypt
- https://github.com/jwilder/nginx-proxy/issues/1132