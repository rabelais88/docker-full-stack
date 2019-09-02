FROM jrcs/letsencrypt-nginx-proxy-companion:latest
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.1/wait /wait
RUN chmod +x /wait
CMD /wait && /bin/bash /app/start.sh