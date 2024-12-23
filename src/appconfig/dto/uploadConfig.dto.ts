import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class UploadAppConfig {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  config: object;
}
