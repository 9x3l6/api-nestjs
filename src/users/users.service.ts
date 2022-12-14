import {
  Injectable,
  NotFoundException,
  Query,
  Inject,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
// import { Video } from 'src/archived-videos/entities/video.entity';
// import { Event } from 'src/events/entities/event.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import usersConfig from './users.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    // @InjectRepository(Video)
    // private readonly videoRepo: Repository<Video>,
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    @Inject(usersConfig.KEY)
    private usersConf: ConfigType<typeof usersConfig>,
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
    console.log(usersConf.foo);
  }

  findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.userRepo.find({
      // relations: ['videos'],
      skip: offset,
      take: limit,
    });
  }

  findOne(id: string) {
    const channel = this.userRepo.findOne(id, {
      relations: ['videos'],
    });
    if (!channel) {
      throw new NotFoundException(`Channel #${id} not found`);
    }
    return channel;
  }

  async create(createUserDto: CreateUserDto) {
    // const videos = await Promise.all(
    //   createUserDto.videos.map(id => this.preloadVideoById(id)),
    // );
    const user = this.userRepo.create({
      ...createUserDto,
      // videos,
    });
    return this.userRepo.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto){
    // const videos = updateUserDto.videos && (await Promise.all(
    //   updateUserDto.videos.map(id => this.preloadVideoById(id)),
    // ));
    const user = await this.userRepo.preload({
      id: +id,
      ...updateUserDto,
      // videos,
    });
    if (!user) {
      throw new NotFoundException(`Channel #${id} not found`);
    }
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }

  // private async preloadVideoById(id: string): Promise<Video> {
  //   const existingVideo = await this.videoRepo.findOne({ videoId: id });
  //   if (existingVideo) {
  //     return existingVideo;
  //   }
  //   return this.videoRepo.create({ videoId: id });
  // }

  // async recommendChannel(channel: Channel) {
  //   const queryRunner = this.connection.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     channel.recommendations++;

  //     const recommendEvent = new Event();
  //     recommendEvent.name = 'recommend_channel';
  //     recommendEvent.type = 'channel';
  //     recommendEvent.payload = { channelId: channel.id };

  //     await queryRunner.manager.save(channel);
  //     await queryRunner.manager.save(recommendEvent);

  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
