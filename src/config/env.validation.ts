import { InternalServerErrorException } from '@nestjs/common';
import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, validateSync } from 'class-validator';

export enum Environment {
  DEVELOPMENT = 'dev',
  PRODUCTION = 'prod',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @Expose()
  ENV?: Environment;
  @Expose()
  PORT?: string;
  @Expose()
  DATABASE_URL?: string;
  @Expose()
  S3_SECRET_ACCESS_KEY?: string;
  @Expose()
  S3_ACCESS_KEY?: string;
  @Expose()
  S3_BUCKET_NAME?: string;
  @Expose()
  S3_CLOUDFRONT_BASE_URL: string;
  @Expose()
  GOOGLE_MAPS_API_KEY: string;
  @Expose()
  AUTH_SERVICE_BASE_URL: string;
  @Expose()
  STORE_SERVICE_BASE_URL: string;
  @Expose()
  ORDER_SERVICE_BASE_URL: string;
  @Expose()
  INTERNAL_TOKEN: string;
  @Expose()
  LITHOS_BASE_URL: string;
  @Expose()
  LITHOS_KEY: string;
  @Expose()
  LITHOS_USER: string;
}

export function validate(config: Record<string, unknown>) {
  const transformedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const errors = validateSync(transformedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new InternalServerErrorException(errors.toString());
  }

  return transformedConfig;
}
