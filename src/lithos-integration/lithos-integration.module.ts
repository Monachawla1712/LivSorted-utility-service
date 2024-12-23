import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LithosIntegrationService } from './lithos-integration.service';
import {
  LithosIntegrationController,
  LithosInternalIntegrationController,
} from './lithos-integration.controller';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [LithosIntegrationService],
  controllers: [
    LithosIntegrationController,
    LithosInternalIntegrationController,
  ],
})
export class LithosIntegrationModule {}
