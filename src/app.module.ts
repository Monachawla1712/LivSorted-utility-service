import { InternalIntegrationModule } from './internal-service-integration/internal-integration.module';

require('newrelic');
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from './media/media.module';
import { AppConfigModule } from './appconfig/appconfig.module';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { RolesGuard } from './common/roles.guard';
import { AppConfigEntity } from './appconfig/entity/appconfig.entity';
import { MapsModule } from './maps/maps.module';
import { LithosIntegrationModule } from './lithos-integration/lithos-integration.module';
import { LoggingMiddleware } from './common/logging.middleware';
import { AsyncContextModule } from '@nestjs-steroids/async-context';
import { PrivilegeEndpointsEntity } from './privilege/entity/privilege-endpoints.entity';
import { PrivilegeService } from './privilege/privilege.service';
import { PrivilegeHandlerInterceptor } from './common/privilege.interceptor';
import { FaqEntity } from './appconfig/entity/faq.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('db_url'),
        entities: [AppConfigEntity, PrivilegeEndpointsEntity, FaqEntity],
      }),
      inject: [ConfigService],
    }),
    AppConfigModule,
    MediaModule,
    MapsModule,
    LithosIntegrationModule,
    InternalIntegrationModule,
    TypeOrmModule.forFeature([PrivilegeEndpointsEntity]),
    AsyncContextModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    LoggingMiddleware,
    PrivilegeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PrivilegeHandlerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
