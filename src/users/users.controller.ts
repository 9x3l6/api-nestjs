import {
  Inject,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
// import { AuthService } from '../auth/auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ApiForbiddenResponse, ApiTags, /*ApiResponse*/ } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
// import { LocalAuthGuard } from '../auth/guards/local-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    let u: User;
    u = await User.findOne({
      // select: ['id', 'username', 'password'],
      where: [
        // { id: req.user.id},
        { username: req.user.username}
      ]
    });
    this.logger.log('info', u);
    if (u) {
      delete u.password;
      delete u.email;
      delete u.phone;
      return u;
    }
  }
}