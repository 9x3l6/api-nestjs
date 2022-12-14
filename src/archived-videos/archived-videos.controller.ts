import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags, /*ApiResponse*/ } from '@nestjs/swagger';
import { ArchivedVideosService } from './archived-videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('archived-videos')
@Controller('archived-videos')
export class ArchivedVideosController {
  constructor(
    private readonly videosService: ArchivedVideosService,
  ) {}

  @Public()
  @Get()
  findAll(
    @Query('search') search: string,
    @Query() paginationQuery,
  ) {
    if (search) {
      return this.videosService.searchForVideos(search);
    }
    return this.videosService.findAll(paginationQuery);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.videosService.findOne(id);
  }

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.videosService.remove(id);
  }
}
