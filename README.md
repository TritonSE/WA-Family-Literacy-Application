# Words Alive

![words-alive](https://github.com/TritonSE/Words-Alive/workflows/words-alive/badge.svg)

Mobile application to discover books and lesson plans, and chat with live volunteers from [Words Alive](https://www.wordsalive.org/). Monorepo for the Words Alive:

- [mobile application](mobile) - React Native, Expo, TypeScript application for families
- [backend](backend) - Go, Postgres API server containing books, lessons, family profiles, and chat threads
- [web](web) - React, TypeScript administrative web app for volunteers to manage the catalog and respond to chat threads

## Setup

Requires:
 - NodeJS + NPM
 - Go
 - Docker
 - Make

First, start the backend's Postgres database:

```bash
$ cd backend
$ docker-compose up -d db
```

Next, compile and run the API server:

```bash
$ cd backend
$ make
$ ./words-alive
```

The backend API server will start and bind to `http://localhost:8080`

When the backend is running, install the dependencies for the mobile application and start it.

```bash
$ cd mobile
$ npm install
$ npm start
```

The mobile application is built and run using [Expo](https://expo.io). To run the app on your iOS or Android device, download [the Expo app](https://expo.io/tools#client).
