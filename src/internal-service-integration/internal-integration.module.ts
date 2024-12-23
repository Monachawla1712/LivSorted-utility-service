import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { InternalIntegrationService } from './internal-integration.service';
import { InternalIntegrationController } from './internal-integration.controller';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [InternalIntegrationService],
  controllers: [InternalIntegrationController],
})
export class InternalIntegrationModule {}
