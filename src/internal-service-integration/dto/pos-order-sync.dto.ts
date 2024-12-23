import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItems {
  @ApiProperty()
  @IsString()
  skuCode: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  discountAmount: number;
}

export class PosOrderSyncDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  customerId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  storeId: string;

  @ApiProperty()
  @IsString()
  channel: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shippingMethod: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMethod: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  deliveryAddress: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  submittedAt: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  voucherCode: string;

  @ApiProperty({ type: [OrderItems] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItems)
  orderItems: OrderItems[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pincode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNumber()
  amountReceived: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  orderDiscountAmount: number;
}
