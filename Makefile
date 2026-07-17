COMPOSE := docker compose -f docker-compose.yml -f docker-compose.dev.yml

docker-up:
	$(COMPOSE) up -d

docker-down:
	$(COMPOSE) down
