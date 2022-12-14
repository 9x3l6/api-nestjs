import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivedChannelsController } from './archived-channels.controller';
import { ArchivedChannelsService } from './archived-channels.service';
import { ArchivedChannelsScheduler } from './archived-channels.scheduler';
import { Channel } from './entities/channel.entity';
import { Video } from 'src/archived-videos/entities/video.entity';
import { Event } from 'src/events/entities/event.entity';
import channelsConfig from './archived-channels.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          store: redisStore,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          ttl: 120
        }),
    }),
    TypeOrmModule.forFeature([
      Channel,
      Video,
      Event,
    ]),
    ConfigModule.forFeature(channelsConfig),
    BullModule.registerQueue({
      name: 'archived-channels',
    }),
  ],
  controllers: [
    ArchivedChannelsController,
  ],
  providers: [
    ArchivedChannelsService,
    ArchivedChannelsScheduler,
  ],
  exports: [
    ArchivedChannelsService,
  ],
})
export class ArchivedChannelsModule {}
