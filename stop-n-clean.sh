docker image prune -f
docker-compose -f compose.stage.yml ps
docker-compose -f compose.stage.yml down
docker-compose -f compose.stage.yml ps