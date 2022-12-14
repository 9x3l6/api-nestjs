import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  Injectable,
  // NotFoundException,
  // Query,
  // Inject,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { InjectS3, S3 } from 'nestjs-s3';
import { ConfigService, ConfigType } from '@nestjs/config';
// import { CreateVideoDto } from './dto/create-video.dto';
// import { ArchivedVideosService } from '../archived-videos/archived-videos.service';
// import * as readline from 'readline';

@Injectable()
export class ArchivedVideosScheduler {
  private readonly logger = new Logger(ArchivedVideosScheduler.name);

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
    // private readonly videosService: ArchivedVideosService,
    @InjectQueue('archived-videos') private readonly videoQueue: Queue
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS, {
    name: 'archived-videos-import-videos-every-12-hours'
  })
  // @Timeout(5)
  async importVideos() {
    this.logger.debug('-- Schedule import videos')
    const handler = async(objects) => {
      if (objects && objects.CommonPrefixes && objects.CommonPrefixes.length > 0) {
        Promise.all(
          objects.CommonPrefixes.map(async (prefix) => {
            try {
              const yes = await this.s3.headObject({
                Bucket: this.configService.get('BUCKET_NAME'),
                Key: `${prefix.Prefix}channel.json`
              }).promise();
              if (yes) {
                this.logger.debug(prefix.Prefix)
                await this.videoQueue.add('import-videos-data', {
                  prefix: prefix.Prefix,
                }).catch(e => {
                  console.log(e);
                });
              }
            } catch (e) {}
          })
        )
      }
    }
    let objects;
    try {
      objects = await this.s3.listObjectsV2({
        Bucket: this.configService.get('BUCKET_NAME'),
        MaxKeys: 1000,
        Delimiter: '/',
      }).promise();
      await handler(objects);
      while (objects && objects.NextContinuationToken) {
        objects = await this.s3.listObjectsV2({
          Bucket: this.configService.get('BUCKET_NAME'),
          MaxKeys: 1000,
          Delimiter: '/',
          ContinuationToken: objects.NextContinuationToken,
        }).promise();
        await handler(objects);
      }
    } catch (e) {
      console.log(e)
    }
  }
}
