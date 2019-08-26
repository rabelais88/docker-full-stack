docker build -f frontend.prod.dockerfile -t frontend:latest .
docker build -f api.prod.dockerfile -t api:latest .
docker-compose -f compose.prod.yml up