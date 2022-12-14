import {
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ description: 'Name of channel'})
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Storage Url of channel'})
  @IsString()
  readonly storageUrl: string;

  @ApiProperty({ description: 'Provider where videos are downloaded from'})
  @IsString()
  readonly provider: string;

  @ApiProperty({ description: 'Directory name where videos are downloaded'})
  @IsString()
  readonly directory: string;

  @ApiProperty({ description: 'Channel url where videos are downloaded from'})
  @IsString()
  readonly url: string;

  @ApiProperty({ description: 'Storage size'})
  @IsString()
  readonly size: string;

  @ApiProperty({ description: 'Number of videos'})
  @IsNumber()
  readonly videosCount: number;

  @ApiProperty({ description: 'True if channel is terminated and unable to download any more videos from channel'})
  @IsBoolean()
  readonly terminated: boolean;

  @ApiProperty({ description: 'True if channel is featured to show up highlighted on the website'})
  @IsBoolean()
  readonly featured: boolean;

  @ApiProperty({ description: 'True if channel critical and videos are downloaded more agressively'})
  @IsBoolean()
  readonly critical: boolean;

  @ApiProperty({ description: 'True if profile.jpg exists in storage'})
  @IsBoolean()
  readonly profile: boolean;

  @ApiProperty({ description: 'True if banner.jpg exists in storage'})
  @IsBoolean()
  readonly banner: boolean;

  // @ApiProperty({ description: 'Channel videos'})
  // @IsString({ each: true, })
  // readonly videos: string[];
}
