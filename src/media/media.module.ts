import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule],
  providers: [MediaService, S3Service],
  controllers: [MediaController],
})
export class MediaModule {}
