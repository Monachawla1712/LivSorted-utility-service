import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';

class Meta {
  @ApiProperty()
  @IsString()
  @IsOptional()
  administrative_area_level_1?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  administrative_area_level_2?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  postal_code?: string;
}

export class AddressResponseDto {
  @ApiProperty()
  @IsString()
  'address_line': string;

  @ApiProperty()
  @IsString()
  'lat': number;

  @ApiProperty()
  @IsString()
  'long': number;

  @ApiProperty()
  @IsString()
  'placeId': string;

  @ApiProperty({ type: Meta })
  @IsObject()
  'meta': Meta;
}

export class PlaceNotFoundDto {
  @ApiProperty()
  @IsString()
  statusCode: number;

  @ApiProperty()
  @IsString()
  message: string;
}

export class Prediction {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  placeId: string;
}

export class AutoCompleteResponseDto {
  @ApiProperty({ type: [Prediction] })
  @IsObject()
  predictions: [Prediction];
}
