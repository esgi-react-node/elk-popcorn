# elk-popcorn

## Requirements

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [GNU/Make](https://www.gnu.org/software/make/)

## Installation

```console
$ git clone git@github.com:esgi-react-node/elk-popcorn.git
$ cd elk-popcorn
$ cp .env.example .env
$ vim .env
```

```
TWITTER_KEY=DJ6....................
TWITTER_KEY_SECRET=LtK.............
TWITTER_TOKEN=569..................
TWITTER_TOKEN_SECRET=13J...........
```

## Commands

Command | Description
---|---
`make start` | Start the Docker Compose services.
`make install` | Install the development dependencies.
`make ingest` | Ingest data from Twitter.
`make client` | Start the client application.
`make server` | Start the server application.
`make stop` | Start the Docker Compose services.
`make restart` | Start the Docker Compose services.

## Endpoints

Endpoint | Requires | Description
---|---|---
localhost:8080 | make client | Client (development)
localhost | make build | Client (production)
localhost:8081 | make server | Server
localhost:5601 | make start | Kibana client

## Environment

If you intend to update the `.env` file, make sure to restart the services to take the environment into account.

```console
$ vim .env
$ make restart
```
