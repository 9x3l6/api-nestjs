import { Module } from '@nestjs/common';
import { ClientOptions } from '@elastic/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import ArchivedVideosSearchService from './archived-videos-search.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTIC_NODE'),
        auth: {
          username: configService.get('ELASTIC_USERNAME'),
          password: configService.get('ELASTIC_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    // ElasticsearchModule.register({
    //   node: process.env.ELASTIC_NODE,
    //   auth: {
    //     username: process.env.ELASTIC_USERNAME,
    //     password: process.env.ELASTIC_PASSWORD,
    //   },
    // }),
  ],
  exports: [
    ElasticsearchService
  ],
  providers: [
    ElasticsearchService,
    ArchivedVideosSearchService,
  ],
})
export class ArchivedVideosSearchModule {}
