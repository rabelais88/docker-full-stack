# production
docker build -f ./frontend/frontend.prod.dockerfile -t test-app_front:latest ./frontend/
docker build -f ./api/api.prod.dockerfile -t test-app_api:latest ./api/
# docker build -f ./traefik -t tset-app_traefik:latest ./traefik/