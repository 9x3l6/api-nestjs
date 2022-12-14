import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectS3, S3 } from 'nestjs-s3';
import { ConfigService, ConfigType } from '@nestjs/config';
import { CreateVideoDto } from './dto/create-video.dto';
import { ArchivedVideosService } from '../archived-videos/archived-videos.service';
import * as readline from 'readline';

@Processor('archived-videos')
export class ArchivedVideosProcessor {
  private readonly logger = new Logger(ArchivedVideosProcessor.name);
  // constructor(
  //   private readonly configService: ConfigService,
  //   private readonly videosService: ArchivedVideosService,
  // ) {}

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
    private readonly videosService: ArchivedVideosService,
  ) {}

  _timeout(timer) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(timer);
      }, timer);
    });
  }
  _providerFromUrl(url: string) {
    if (
      url.indexOf('youtube.com') !== -1 ||
      url.indexOf('youtu.be') !== -1
    ) {
      return 'youtube';
    } else if (url.indexOf('bitchute') !== -1) {
      return 'bitchute';
    } else if (url.indexOf('odysee') !== -1) {
      return 'odysee';
    } else if (url.indexOf('rumble') !== -1) {
      return 'rumble';
    } else {
      return null;
    }
  }

  async _importVideo(Prefix: string, v: any) {
    const exists = await this.videosService.findOneByVideoId(v.id);
    const item: CreateVideoDto = {
      videoId: v.id,
      title: v.title,
      description: '',
      path: v.path,
      url: v.url,
      duration: v.duration,
      uploaded: v.uploaded,
      tags: v.tags,
      width: v.width,
      height: v.height,
      storageUrl: `${this.configService.get('STORAGE_URL')}/${this.configService.get('BUCKET_NAME')}`,
      directory: Prefix.replace(/\/$/, ''),
      provider: this._providerFromUrl(v.url),
      removed: v.removed ? true : false,
    };
    if(!exists) {
      return await this.videosService.create(item);
    } else {
      return await this.videosService.update(exists.id, item);
    }
  }
  async _processVideosJSON(Prefix: string) {
    const data = await this.s3.getObject({
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: `${Prefix}videos.json`
    }).promise();
    const videos = [];
    const vids = data.Body.toString('utf-8').split('\n');
    for (let vid of vids) {
      if (vid.trim() != '') {
        let data = [];
        try {
          data = JSON.parse(vid);
        } catch (e) {
          data = null;
        }
        if (data) {
          const result = await this._importVideo(Prefix, data);
          videos.push(result);
        }
      }
    }
    return videos;
  }

  @Process('import-videos-json')
  async importVideosJSON(job: Job) {
    this.logger.debug(job.data.prefix);
    try {
      const ex = await this.s3.headObject({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: `${job.data.prefix}videos.json`
      }).promise().catch(() => {});
      if (ex && ex.ContentLength > 0) {
        const p = await this._processVideosJSON(job.data.prefix).catch(e => {
          console.log(e);
        });
        // console.log(p, 'p')
      }
    } catch (e) {
      console.log(e)
    }
  }

  async _getRemovedVideos(Prefix) {
    let removed = [];
    try {
      const data = await this.s3.getObject({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: `${Prefix}removed.json`
      }).promise();
      if (data) {
        try {
          removed = JSON.parse(
            data.Body.toString('utf-8')
          );
        } catch (e) {
          console.log(`!! ${Prefix}`)
        }
      }
    } catch (e) {}
    return removed;
  }

  async _getVideoInfo(path, removed) {
    let info;
    try {
      const data = await this.s3.getObject({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: `${path}.info.json`
      }).promise();
      try {
        info = JSON.parse(data.Body.toString('utf-8'));
      } catch (e) {
        console.log(`!! ${path}`)
      }
    } catch (e) {}
    if (info && info.id) {
      return {
        id: info.id,
        title: info.title,
        tags: info.tags ? info.tags : [],
        url: info.webpage_url,
        duration: info.duration
          ? parseInt(info.duration, 10) : 0,
        uploaded: info.upload_date
          ? info.upload_date : '',
        width: info.width
          ? info.width : 0,
        height: info.height
          ? info.height : 0,
        provider: info.extractor
          ? info.extractor : this._providerFromUrl(info.webpage_url),
        path,
        removed: removed.find(v => {
          v.id ===info.id
        }) ? true : false,
      }
    }
    return null;
  }

  @Process('import-videos-data')
  async importVideosData(job: Job) {
    this.logger.debug(job.data.prefix);
    const removed = await this._getRemovedVideos(job.data.prefix);
    const handler = async(Prefix, objects) => {
      for (let f of objects.Contents) {
        if (/\.mp4$/.test(f.Key)) {
          const path = f.Key.replace(/\.mp4$/, '');
          const ex = await this.s3.headObject({
            Bucket: this.configService.get('BUCKET_NAME'),
            Key: `${path}.info.json`
          }).promise().catch(() => {});
          if (ex && ex.ContentLength > 0) {
            const data = await this._getVideoInfo(path, removed).catch(e => {
              console.log(e);
            });
            const result = await this._importVideo(Prefix, data);
            // console.log(result)
          }
        }
      }
    }
    let objects;
    try {
      objects = await this.s3.listObjectsV2({
        Bucket: this.configService.get('BUCKET_NAME'),
        MaxKeys: 1000,
        Delimiter: '/',
        Prefix: job.data.prefix,
      }).promise().catch(() => {});
      const videos = [];
      if (
        objects &&
        objects.Contents &&
        objects.Contents.length > 0
      ) {
        const data = await handler(job.data.prefix, objects);
      }
      while (
        objects &&
        objects.NextContinuationToken
      ) {
        objects = await this.s3.listObjectsV2({
          Bucket: this.configService.get('BUCKET_NAME'),
          MaxKeys: 1000,
          Delimiter: '/',
          ContinuationToken: objects.NextContinuationToken,
        }).promise();
        if (
          objects &&
          objects.Contents &&
          objects.Contents.length > 0
        ) {
          const data = await handler(job.data.prefix, objects);
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}