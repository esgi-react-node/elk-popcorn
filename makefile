.PHONY: start stop restart run install

start:
	docker-compose up --detach node elasticsearch kibana

stop:
	docker-compose down --remove-orphans --volumes --timeout 0

restart: stop start

run:
	docker-compose exec node yarn ts-node src/main.ts

install:
	docker-compose exec node yarn install
