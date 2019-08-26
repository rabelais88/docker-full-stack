docker image prune -f
docker-compose -f compose.prod.yml ps
docker-compose -f compose.prod.yml down
docker-compose -f compose.prod.yml ps