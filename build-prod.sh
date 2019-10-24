# production
docker build -f ./frontend/frontend.prod.dockerfile -t test-app-dev_front:latest ./frontend/
docker build -f ./api/api.prod.dockerfile -t test-app-dev_api:latest ./api/