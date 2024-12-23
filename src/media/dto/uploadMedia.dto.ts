import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadMediaDto {
  @ApiProperty()
  @IsString()
  resourceName: string;
}
