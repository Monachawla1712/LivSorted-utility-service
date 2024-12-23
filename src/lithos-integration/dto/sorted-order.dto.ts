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

class SortedOrderContactDetails {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone: string;
}

class SortedMetadata {
  @ApiProperty({ type: SortedOrderContactDetails })
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => SortedOrderContactDetails)
  contactDetails: SortedOrderContactDetails;
}

class OfferData {
  @ApiPropertyOptional()
  @IsOptional()
  lithosRefId: number;

  @ApiPropertyOptional()
  @IsOptional()
  amount: number;
}

class SortedOrderItemMetadata {
  @IsOptional()
  productName: string;

  @IsOptional()
  pieces: number;
}

class SortedOrderItems {
  @ApiProperty()
  @IsNumber()
  finalQuantity: number;

  @ApiProperty()
  @IsNumber()
  salePrice: number;

  @ApiProperty()
  @IsString()
  skuCode: string;

  @ApiProperty({ type: SortedOrderItemMetadata })
  @IsObject()
  @Type(() => SortedOrderItemMetadata)
  metadata: SortedOrderItemMetadata;

  @ApiProperty()
  @IsString()
  name: string;
}

export class SortedOrderDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  customerId: string;

  @ApiProperty()
  @IsNumber()
  lithosOrderId: number;

  @ApiProperty()
  @IsString()
  storeId: string;

  @ApiProperty()
  @IsNumber()
  totalSpGrossAmount: number;

  @ApiProperty()
  @IsNumber()
  finalBillAmount: number;

  @ApiProperty()
  @IsNumber()
  amountReceived: number;

  @ApiProperty()
  @IsNumber()
  totalDiscountAmount: number;

  @ApiProperty()
  @IsString()
  channel: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shippingMethod: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentMethod: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  deliveryAddress: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({ type: SortedMetadata })
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => SortedMetadata)
  metadata: SortedMetadata;

  @ApiProperty({ type: OfferData })
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => OfferData)
  offerData: OfferData;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: [SortedOrderItems] })
  @ArrayMinSize(1)
  @Type(() => SortedOrderItems)
  orderItems: SortedOrderItems[];
}
