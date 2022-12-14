import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
// import { Video } from 'src/archived-videos/entities/video.entity';
// import { Event } from 'src/events/entities/event.entity';
import usersConfig from './users.config';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/constants';
@Module({
  imports: [
    ConfigModule.forFeature(usersConfig),
    TypeOrmModule.forFeature([
      User,
      // Video,
      // Event,
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '7d' },
      })
    }),
  ],
  providers: [
    UsersService,
    AuthService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
