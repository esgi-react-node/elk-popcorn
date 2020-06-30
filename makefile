.PHONY: start stop restart run

start:
	docker-compose up --detach node

stop:
	docker-compose down --remove-orphans --volumes --timeout 0

restart: stop start

run:
	docker-compose exec node yarn ts-node src/main.ts
