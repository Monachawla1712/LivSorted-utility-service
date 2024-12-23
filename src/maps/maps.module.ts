import { Module } from '@nestjs/common';
import { MapsController } from './maps.controller';
import { HttpModule } from '@nestjs/axios';
import { MapService } from './maps.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [MapService],
  controllers: [MapsController],
})
export class MapsModule {}
