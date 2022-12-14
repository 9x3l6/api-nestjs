<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

docker-compose up -d
npm run start:dev

nest g mo archived-channels
nest g co archived-channels
nest g s archived-channels
nest g class archived-channels/entities/channel.entity
nest g class archived-channels/dto/create-channel.dto
nest g class archived-channels/dto/update-channel.dto
npm i -S class-validator class-transformer
npm i -S @nestjs/mapped-types
npm install --save @nestjs/typeorm typeorm pg
nest g mo archived-videos
nest g co archived-videos
nest g s archived-videos
nest g class archived-videos/entities/video.entity
nest g class common/dto/pagination-query.dto
nest g mo events
nest g class events/entities/event.entity
nest g mo database
npx typeorm migration:create -n archived-channels
npx typeorm migration:create -n archived-videos
npm run build
npx typeorm migration:run
npm i -S @nestjs/config
nest g mo common
nest g interceptor common/interceptors/wrap-response
nest g interceptor common/interceptors/timeout
nest g middleware common/middleware/logging
npm install --save @nestjs/swagger swagger-ui-express
nest g mo auth
nest g co auth
nest g class auth/constants
nest g s auth
nest g mo users
nest g co users
nest g s users
nest g cl users/entities/user.entity
nest g cl users/dto/create-user.dto
nest g cl users/dto/update-user.dto
nest g guard auth/guards/local-auth
nest g guard auth/guards/jwt-auth
npm i -S @nestjs/passport passport-local @nestjs/jwt passport-jwt passport
npm install --save-dev @types/passport-local @types/passport-jwt
nest g cl auth/strategies/jwt.strategy
nest g cl auth/strategies/local.strategy
nest g cl auth/constants
npm i --save helmet
npm i --save @nestjs/throttler
npm install --save @nestjs/schedule
npm install --save-dev @types/cron
nest g mo tasks
nest g co tasks
nest g s tasks
npm install -S @types/bcrypt bcrypt
npm install -S nestjs-s3 aws-sdk
npm install --save @nestjs/bull bull
npm install --save-dev @types/bull
npm install cache-manager
nest g cl archived-videos/cacheKey.constant
nest g cl archived-channels/cacheKey.constant
nest g in common/interceptors/httpCache
npm i -S parseurl
npm i -S cache-manager-redis-store
nest g cl archived-videos/archived-videos.processor
nest g cl archived-channels/archived-channels.processor
npm install --save @nestjs/elasticsearch @elastic/elasticsearch
nest g mo archived-videos-search
nest g s archived-videos-search
