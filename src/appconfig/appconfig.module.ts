import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './appconfig.service';
import { AppConfigController } from './appconfig.controller';
import { AppConfigEntity } from './entity/appconfig.entity';
import { FaqEntity } from './entity/faq.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([AppConfigEntity, FaqEntity]),
  ],
  providers: [AppConfigService],
  controllers: [AppConfigController],
})
export class AppConfigModule {}
