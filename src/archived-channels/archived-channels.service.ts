import {
  Injectable,
  NotFoundException,
  Query,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';
import { Video } from 'src/archived-videos/entities/video.entity';
import { Event } from 'src/events/entities/event.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import channelsConfig from './archived-channels.config';
import { GET_ARCHIVED_CHANNELS_CACHE_KEY } from './cache-key.constant';

@Injectable()
export class ArchivedChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(Video)
    private readonly videoRepo: Repository<Video>,
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    @Inject(channelsConfig.KEY)
    private channelsConf: ConfigType<typeof channelsConfig>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // const databaseHost = this.configService.get<string>('DATABASE_HOST'); // env
    // const databaseHost = this.configService.get('database.host', 'localhost'); // app.config
    // console.log(databaseHost);
    /* Grab coffees config within App */
    // const coffeesConfig = this.configService.get('coffees');
    // console.log(coffeesConfig);

    // /* Grab nested property within coffees config */
    // const foo = this.configService.get('coffees.foo');
    // console.log(foo);
    // console.log(channelsConf.foo);
  }

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_ARCHIVED_CHANNELS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    })
  }

  find() {
    return this.channelRepo.find();
  }

  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const { limit, offset } = paginationQuery;
    return this.channelRepo.find({
      relations: ['videos'],
      skip: offset,
      take: limit,
    });
  }

  findOne(
    id: string,
  ) {
    const channel = this.channelRepo.findOne(id, {
      relations: ['videos'],
    });
    if (!channel) {
      throw new NotFoundException(`Channel #${id} not found`);
    }
    return channel;
  }

  findOneByName(
    name: string,
  ) {
    const channel = this.channelRepo.findOne({ name });
    if (!channel) {
      throw new NotFoundException(`Channel #${name} not found`);
    }
    return channel;
  }

  async createOrUpdate(
    couChannelDto: CreateChannelDto,
  ) {
    const channel = await this.findOneByName(couChannelDto.name);
    if (!channel) {
      this.create(couChannelDto)
    } else {
      this.update( channel.id, couChannelDto)
    }
  }

  async create(
    createChannelDto: CreateChannelDto,
  ) {
    // const videos = await Promise.all(
    //   createChannelDto.videos.map(id => this.preloadVideoById(id)),
    // );
    const channel = this.channelRepo.create({
      ...createChannelDto,
      // videos,
    });
    await this.channelRepo.save(channel);
    await this.clearCache();
    return channel;
  }

  async update(
    id: number,
    updateChannelDto: UpdateChannelDto,
  ){
    // const videos = updateChannelDto.videos && (await Promise.all(
    //   updateChannelDto.videos.map(id => this.preloadVideoById(id)),
    // ));
    const channel = await this.channelRepo.preload({
      id: +id,
      ...updateChannelDto,
      // videos,
    });
    if (!channel) {
      throw new NotFoundException(`Channel #${id} not found`);
    }
    await this.channelRepo.save(channel);
    await this.clearCache();
    return channel;
  }

  async remove(
    id: string,
  ) {
    // const channel = await this.findOne(id);
    // await this.channelRepo.remove(channel);
    const resp = await this.channelRepo.delete(id);
    if (!resp.affected) {
      throw new NotFoundException(`Channel #${id} not found`);
    }
    await this.clearCache();
  }

  private async preloadVideoById(
    id: string,
  ): Promise<Video> {
    const existingVideo = await this.videoRepo.findOne({ videoId: id });
    if (existingVideo) {
      return existingVideo;
    }
    return this.videoRepo.create({ videoId: id });
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
}
