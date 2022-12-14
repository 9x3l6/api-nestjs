import {
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'First name'})
  @IsString()
  readonly first: string;

  @ApiProperty({ description: 'Family name'})
  @IsString()
  readonly last: string;

  @ApiProperty({ description: 'Email address'})
  @IsString()
  readonly email: string;

  @ApiProperty({ description: 'Phone number'})
  @IsString()
  readonly phone: string;

  @ApiProperty({ description: 'Username'})
  @IsString()
  readonly username: string;

  @ApiProperty({ description: 'Password'})
  @IsString()
  readonly password: string;

}
