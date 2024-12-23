import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class LithosStore {
  @ApiProperty()
  @IsNumber()
  ID: number;

  @ApiProperty()
  @IsString()
  Name: string;
}

class LithosCustomer {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  ID: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  Name: string;

  @ApiProperty()
  @IsString()
  Mobile: string;
}

class LithosDeliveryAddress {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  ID: number;

  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsString()
  Phone: string;

  @ApiProperty()
  @IsString()
  Address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  FlatNo: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ZIP: string;
}

class LithosCartList {
  @ApiProperty()
  @IsNumber()
  ID: number;

  @ApiProperty()
  @IsNumber()
  MRP: number;

  @ApiProperty()
  @IsNumber()
  Sale_Rate: number;

  @ApiProperty()
  @IsNumber()
  Qty: number;

  @ApiProperty()
  @IsNumber()
  GrandAmount: number;

  @ApiProperty()
  @IsNumber()
  TotalPrice: number;
}

export class ReceiptListItem {
  @ApiProperty()
  @IsNumber()
  PayId: number;

  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsNumber()
  Type: number;

  @ApiProperty()
  @IsNumber()
  Amount: number;
}

export class LithosOrderDto {
  @ApiProperty()
  @IsNumber()
  ID: number;

  @ApiProperty()
  @IsString()
  Type: string;

  @ApiProperty()
  @IsString()
  Date: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  DeliveryTime: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ChannelOrderId: string;

  @ApiProperty()
  @IsNumber()
  TotalAmount: number;

  @ApiProperty()
  @IsNumber()
  DiscountAmount: number;

  @ApiProperty()
  @IsString()
  Status: string;

  @ApiProperty({ type: LithosStore })
  @IsObject()
  @Type(() => LithosStore)
  @ValidateNested({ each: true })
  Store: LithosStore;

  @ApiProperty({ type: LithosCustomer })
  @IsObject()
  @Type(() => LithosCustomer)
  @ValidateNested({ each: true })
  Customer: LithosCustomer;

  @ApiProperty({ type: LithosDeliveryAddress })
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => LithosDeliveryAddress)
  DeliveryAddress: LithosDeliveryAddress;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ isArray: true, type: [LithosCartList] })
  @ArrayMinSize(1)
  @Type(() => LithosCartList)
  CartList: LithosCartList[];

  @ApiProperty()
  @IsNumber()
  PaymentType: number;

  @ApiProperty()
  @IsNumber()
  PaymentId: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ isArray: true, type: [ReceiptListItem] })
  @Type(() => ReceiptListItem)
  ReceiptList: ReceiptListItem[];
}
