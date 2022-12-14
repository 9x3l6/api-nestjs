import type { ClientOpts as RedisClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ArchivedChannelsModule } from './archived-channels/archived-channels.module';
import { ArchivedVideosModule } from './archived-videos/archived-videos.module';
import { EventsModule } from './events/events.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import appConfig from './config/app.config';
import * as Joi from '@hapi/joi';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { TasksModule } from './tasks/tasks.module';
import { PostsModule } from './posts/posts.module';
import { StorageModule } from './storage/storage.module';
import { ArchivedVideosSearchModule } from './archived-videos/search/archived-videos-search.module';
import * as winston from 'winston';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOpts>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL'),
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: +configService.get('REDIS_PORT'),
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        LOG_PATH: Joi.required(),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_NAME: Joi.required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
      load: [appConfig],
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
        },
      })
    }),
    // ElasticsearchModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     node: configService.get('ELASTIC_NODE'),
    //     auth: {
    //       username: configService.get('ELASTIC_USERNAME'),
    //       password: configService.get('ELASTIC_PASSWORD'),
    //     }
    //   }),
    //   inject: [ConfigService],
    // }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transports: [
          // new winston.transports.File({
          //   filename: `${process.cwd()}/${configService.get('LOG_PATH')}`,
          // }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              nestWinstonModuleUtilities.format.nestLike(),
            ),
          }),
        ],
      }),
    }),
    DatabaseModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    ScheduleModule.forRoot(),
    StorageModule,
    ArchivedChannelsModule,
    ArchivedVideosModule,
    // ArchivedVideosSearchModule,
    EventsModule,
    DatabaseModule,
    CommonModule,
    AuthModule,
    UsersModule,
    TasksModule,
    PostsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule {}
