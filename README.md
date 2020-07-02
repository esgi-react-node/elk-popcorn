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

## Commands

Command | Description
---|---
`make start` | Start the Docker Compose services.
`make install` | Install the development dependencies.
`make ingest` | Ingest data from Twitter.
`make client` | Start the client application available at http://localhost:8080.
`make server` | Start the server application available at http://localhost:8081.
`make stop` | Start the Docker Compose services.
`make restart` | Start the Docker Compose services.
