import { ValidationPipe } from '@nestjs/common';

export const WhitelistSkipValidation = new ValidationPipe({
  whitelist: true,
  skipNullProperties: true,
  skipUndefinedProperties: true,
});

export const WhitelistErrorValidation = new ValidationPipe({
  forbidUnknownValues: true,
  forbidNonWhitelisted: true,
  whitelist: true,
});
