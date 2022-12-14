import {
  Injectable,
  NotFoundException,
  Query,
  Inject,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, In } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { Channel } from 'src/archived-channels/entities/channel.entity';
import { Event } from 'src/events/entities/event.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import videosConfig from './archived-videos.config';
import ArchivedVideosSearchService from 'src/archived-videos/search/archived-videos-search.service';

@Injectable()
export class ArchivedVideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepo: Repository<Video>,
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    @Inject(videosConfig.KEY)
    private videosConf: ConfigType<typeof videosConfig>,
    private searchService: ArchivedVideosSearchService,
  ) {
    // const databaseHost = this.configService.get<string>('DATABASE_HOST'); // env
    // const databaseHost = this.configService.get('database.host', 'localhost'); // app.config
    // console.log(databaseHost);
    /* Grab coffees config within App */
    // const coffeesConfig = this.configService.get('coffees');
    // console.log(coffeesConfig);

    // /* Grab nested property within coffees config */
    const foo = this.configService.get('coffees.foo');
    console.log(foo);
    console.log(videosConf.foo);
  }

  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const { limit, offset } = paginationQuery;
    return this.videoRepo.find({
      relations: ['channel'],
      skip: offset,
      take: limit,
    });
  }

  findOne(
    id: number,
  ) {
    const video = this.videoRepo.findOne(id, {
      relations: ['channel'],
    });
    if (!video) {
      throw new NotFoundException(`Video #${id} not found`);
    }
    return video;
  }

  async findOneByVideoId(
    videoId: string,
  ): Promise<Video> {
    // let video: Promise<Video>;
    return await Video.findOne({
      where: [
        { videoId }
      ]
    });
    // return video;
  }

  async createOrUpdate(
    couVideoDto: CreateVideoDto,
  ) {
    const video = await this.findOneByVideoId(couVideoDto.videoId);
    if (!video) {
      return this.create(couVideoDto);
    } else {
      return this.update( video.id, couVideoDto);
    }
  }

  async create(
    createVideoDto: CreateVideoDto,
  ) {
    // const videos = await Promise.all(
    //   createChannelDto.videos.map(id => this.preloadVideoById(id)),
    // );
    const video = await this.videoRepo.create({
      ...createVideoDto,
      // videos,
    });
    await this.videoRepo.save(video);
    this.searchService.indexVideo(video);
    return video;
  }

  async update(
    id: number,
    updateVideoDto: UpdateVideoDto,
  ){
    // const videos = updateChannelDto.videos && (await Promise.all(
    //   updateChannelDto.videos.map(id => this.preloadVideoById(id)),
    // ));
    const video = await this.videoRepo.preload({
      id: +id,
      ...updateVideoDto,
      // videos,
    });
    if (!video) {
      throw new NotFoundException(`Video #${id} not found`);
    }
    await this.videoRepo.save(video);
    await this.searchService.update(video);
    return video;
  }

  async remove(id: number) {
    // const video = await this.findOne(id);
    // return this.videoRepo.remove(video);
    const deleteResponse = await this.videoRepo.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`ArchivedVideo #${id} not found`);
    }
    await this.searchService.remove(id);
  }

  private async preloadVideoById(name: string): Promise<Channel> {
    const existingChannel = await this.channelRepo.findOne({ name });
    if (existingChannel) {
      return existingChannel;
    }
    return this.channelRepo.create({ name });
  }

  async recommendChannel(channel: Channel) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      channel.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_channel';
      recommendEvent.type = 'channel';
      recommendEvent.payload = { channelId: channel.id };

      await queryRunner.manager.save(channel);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async searchForVideos(text: string) {
    const results = await this.searchService.search(text);
    const ids = results.map(result => result.id);
    if (!ids.length) {
      return [];
    }
    return this.videoRepo
      .find({
        where: { id: In(ids) }
      });
  }
}
