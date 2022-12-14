import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivedVideosController } from './archived-videos.controller';
import { ArchivedVideosService } from './archived-videos.service';
import { Video } from './entities/video.entity';
import { Channel } from 'src/archived-channels/entities/channel.entity';
import { Event } from 'src/events/entities/event.entity';
import videosConfig from './archived-videos.config';
import { ArchivedVideosScheduler } from './archived-videos.scheduler';
import { ArchivedVideosProcessor } from './archived-videos.processor';
import ArchivedVideosSearchService from 'src/archived-videos/search/archived-videos-search.service';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      Video,
      Event,
    ]),
    ConfigModule.forFeature(videosConfig),
    BullModule.registerQueue({
      name: 'archived-videos',
    }),
    ElasticsearchModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        imports: [ConfigModule],
        node: configService.get('ELASTIC_NODE'),
        auth: {
          username: configService.get('ELASTIC_USERNAME'),
          password: configService.get('ELASTIC_PASSWORD'),
        }
      }),
      inject: [ConfigService],
    }),
    // ElasticsearchModule.register({
    //   nodes: process.env.ELASTIC_NODE,
    //   auth: {
    //     username: process.env.ELASTIC_USERNAME,
    //     password: process.env.ELASTIC_PASSWORD,
    //   },
    // }),
  ],
  controllers: [
    ArchivedVideosController,
  ],
  providers: [
    ArchivedVideosService,
    ArchivedVideosScheduler,
    ArchivedVideosProcessor,
    ArchivedVideosSearchService,
    // ElasticsearchService
  ],
  exports: [
    ArchivedVideosService,
  ],
})
export class ArchivedVideosModule {}
