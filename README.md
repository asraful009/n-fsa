# File Sharing App

## _upload, list, share, delete_

Asraful Islam

## Tech

- [Node.js] - node.js v16.16.0.
- [yarn] - node.js package manager. (https://yarnpkg.com/) ()
- [NestJS] - node.js framework. (https://nestjs.com/) (https://docs.nestjs.com/)
- [mysql] - database for file info (https://hub.docker.com/_/mysql)
- [typeorm] - typeorm for db ORM. (https://typeorm.io/)
- [swagger] - swagger for api doc. (https://swagger.io/)
- [Jest] - delightful JavaScript Testing Framework (https://jestjs.io/)
- [docker] - docker for mysql db (https://www.docker.com/) (https://hub.docker.com/)
- [docker-compose] - Tool for defining and running multi-container Docker. (https://docs.docker.com/compose/)

## Installation

Create mysqlDB docker container

```sh
run-docker.sh
```

Install Project package

```sh
yarn install
```

## Configuration

change `.env` file if needed

## Testing

Run Test

```sh
yarn test
```

## Build

To build Project in prod mode

```sh
yarn build
```

## Running

To Run Project in DEV mode

```sh
yarn dev
```

Run Project in prod mode

```sh
node dist/main.js
```

## API

API Doc
http://localhost:8080/doc

API
http://localhost:8080/

## License

MIT
