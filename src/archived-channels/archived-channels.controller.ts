import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  CacheTTL,
  CacheKey,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags, /*ApiResponse*/ } from '@nestjs/swagger';
import { ArchivedChannelsService } from './archived-channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { GET_ARCHIVED_CHANNELS_CACHE_KEY } from './cache-key.constant';
import { Public } from 'src/common/decorators/public.decorator';

@UseInterceptors(CacheInterceptor)
@ApiTags('archived-channels')
@Controller('archived-channels')
export class ArchivedChannelsController {
  constructor(
    private readonly channelsService: ArchivedChannelsService
  ) {}

  
  @CacheKey(GET_ARCHIVED_CHANNELS_CACHE_KEY)
  @CacheTTL(120)
  @Public()
  @Get()
  findAll(@Query() paginationQuery) {
    return this.channelsService.findAll(paginationQuery);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelsService.remove(id);
  }
}
