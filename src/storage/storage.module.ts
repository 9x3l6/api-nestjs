import { Module } from '@nestjs/common';
import { S3Module } from 'nestjs-s3';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          accessKeyId: configService.get('MINIO_ROOT_USER'),
          secretAccessKey: configService.get('MINIO_ROOT_PASSWORD'),
          endpoint: configService.get('STORAGE_URL'),
          s3ForcePathStyle: true,
          signatureVersion: 'v4',
        },
      }),
    }),
  ],
})
export class StorageModule {}
