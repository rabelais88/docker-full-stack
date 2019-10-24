docker build -f ./frontend/frontend.dev.dockerfile -t test-app-dev_front:latest ./frontend/
docker build -f ./api/api.prod.dockerfile -t test-app-dev_api:latest ./api/