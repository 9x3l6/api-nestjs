import {
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginLocalDto {
  @ApiProperty({ description: 'Identifier'})
  @IsString()
  readonly username: string;

  @ApiProperty({ description: 'Password'})
  @IsString()
  readonly password: string;
}
