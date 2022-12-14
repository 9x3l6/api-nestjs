import {
  Injectable,
  NotFoundException,
  Query,
  Inject,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { InjectS3, S3 } from 'nestjs-s3';
import { ConfigService } from '@nestjs/config';
import { ArchivedChannelsService } from './archived-channels.service';

@Injectable()
export class ArchivedChannelsScheduler {
  private readonly logger = new Logger(ArchivedChannelsScheduler.name);
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
    private readonly channelsService: ArchivedChannelsService,
  ) {}

  async _importChannelData(Prefix, channel) {
    const c = await this.channelsService.findOneByName(Prefix.replace(/\/$/, ''));
    const ch = {
      name: Prefix.replace(/\/$/, ''),
      storageUrl: this.configService.get('STORAGE_URL'),
      provider: channel.provider,
      directory: channel.directory,
      url: channel.url,
      size: channel.size,
      videosCount: channel.ic,
      terminated: channel.terminated,
      featured: channel.featured,
      critical: channel.critical,
      profile: channel.profile,
      banner: channel.banner,
    };
    if (!c) {
      return await this.channelsService.create(ch);
    } else {
      return await this.channelsService.update(c.id, ch);
    }
  }
  async _processChannelJSON(Prefix: string) {
    let data;
    try {
      const channel = await this.s3.getObject({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: `${Prefix}channel.json`
      }).promise();
      let c = channel.Body.toString('utf-8');
      try {
        data = JSON.parse(c);
      } catch (e) {
        console.log(`!! ${Prefix}`)
      }
    } catch (e) {}
    if (data && data.directory) {
      const result = await this._importChannelData(Prefix, data);
      return result;
    }
    return Promise.resolve(null);
  }

  @Cron(CronExpression.EVERY_30_MINUTES, {
    name: 'archived-channels-import-channels-every-30-minutes'
  })
  async importChannels() {
    this.logger.debug('-- importChannels')
    let objects;
    try {
      objects = await this.s3.listObjectsV2({
        Bucket: this.configService.get('BUCKET_NAME'),
        MaxKeys: 1000,
        Delimiter: '/',
      }).promise();
      if (objects && objects.CommonPrefixes && objects.CommonPrefixes.length > 0) {
        Promise.all(
          objects.CommonPrefixes.map(async (prefix) => {
            try {
              const ex = await this.s3.headObject({
                Bucket: this.configService.get('BUCKET_NAME'),
                Key: `${prefix.Prefix}channel.json`
              }).promise().catch(() => {});
              if (ex && ex.ContentLength > 0) {
                this.logger.debug(prefix.Prefix);
                await this._processChannelJSON(prefix.Prefix).catch(e => {
                  console.log(e);
                });
              }
            } catch (e) {
              console.log(e)
            }
          })
        );
      }
      while (objects && objects.NextContinuationToken) {
        objects = await this.s3.listObjectsV2({
          Bucket: this.configService.get('BUCKET_NAME'),
          MaxKeys: 1000,
          Delimiter: '/',
          ContinuationToken: objects.NextContinuationToken,
        }).promise();
        if (objects && objects.CommonPrefixes && objects.CommonPrefixes.length > 0) {
          Promise.all(
            objects.CommonPrefixes.map(async (prefix) => {
              try {
                const ex = await this.s3.headObject({
                  Bucket: this.configService.get('BUCKET_NAME'),
                  Key: `${prefix.Prefix}channel.json`
                }).promise().catch(() => {});
                if (ex && ex.ContentLength > 0) {
                  this.logger.debug(prefix.Prefix);
                  await this._processChannelJSON(prefix.Prefix).catch(e => {
                    console.log(e);
                  });
                }
              } catch (e) {
                console.log(e)
              }
            })
          );
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}
