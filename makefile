.PHONY: start stop restart ingest install build server

start:
	docker-compose up --detach node elasticsearch kibana nginx

stop:
	docker-compose down --remove-orphans --volumes --timeout 0

restart: stop start

ingest:
	docker-compose exec node yarn ts-node tools/ingest.ts

install:
	docker-compose exec node yarn install

client:
	docker-compose exec node yarn client

build:
	docker-compose exec node yarn build
	
server:
	docker-compose exec node yarn ts-node server/main.ts
