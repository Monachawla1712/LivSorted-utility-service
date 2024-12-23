import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CordinatesDto {
  @ApiProperty()
  @IsString()
  placeId: string;
}

export class AddressDto {
  @ApiProperty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNumber()
  long: number;
}

export class AutoCompleteDto {
  @ApiProperty()
  @IsString()
  input: string;
}
