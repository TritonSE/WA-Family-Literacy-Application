# Words Alive backend

Go + Postgres REST API containing books, lessons, chat threads, and family profiles.

## Setup

Requires:
 - Go
 - Docker
 - Make

First, start the Postgres database:

```bash
$ docker-compose up -d db
```

Next, compile and run the API server:

```bash
$ make
$ ./words-alive
```

The API server will start and bind to `http://localhost:8080`
