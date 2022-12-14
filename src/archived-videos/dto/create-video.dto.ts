import {
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({ description: 'Video ID issued by provider'})
  @IsString()
  readonly videoId: string;

  @ApiProperty({ description: 'Title of video'})
  @IsString()
  readonly title: string;

  @ApiProperty({ description: 'Description of video'})
  @IsString()
  readonly description: string;

  @ApiProperty({ description: 'Video tags'})
  @IsString({ each: true, })
  readonly tags: string[];

  @ApiProperty({ description: 'Url to video'})
  @IsString()
  readonly url: string;

  @ApiProperty({ description: 'Duration of video'})
  @IsNumber()
  readonly duration: number;

  @ApiProperty({ description: 'Directory name where videos are downloaded'})
  @IsString()
  readonly uploaded: string;

  @ApiProperty({ description: 'Width of video'})
  @IsNumber()
  readonly width: number;

  @ApiProperty({ description: 'Height of video'})
  @IsNumber()
  readonly height: number;

  @ApiProperty({ description: 'Storage url to where video is stored'})
  @IsString()
  readonly storageUrl: string;

  @ApiProperty({ description: 'Directory where video is located'})
  @IsString()
  readonly directory: string;

  @ApiProperty({ description: 'Path to video'})
  @IsString()
  readonly path: string;

  @ApiProperty({ description: 'Provider of video'})
  @IsString()
  readonly provider: string;

  @ApiProperty({ description: 'Video removed'})
  @IsBoolean()
  readonly removed: boolean;
}
