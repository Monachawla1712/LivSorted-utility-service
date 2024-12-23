import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Config } from './config/configuration';
import { LoggerFactory } from './common/logger-factory';
//import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('utility_app'),
  });
  app.enableCors();
  app.setGlobalPrefix('util');
  const config = app.get<ConfigService<Config, true>>(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Consumer store services')
    .setDescription('Consumer APIs for stores services')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/util/docs', app, document);

  await app.listen(config.get<number>('port'));
}
bootstrap();
