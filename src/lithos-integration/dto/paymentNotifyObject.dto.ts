import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class PaymentNotifyObjectDto {
  @ApiProperty()
  @IsString()
  paymentMode: string;

  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderAmount: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  txStatus: string;

  @ApiPropertyOptional()
  @IsOptional()
  paymentGatewayResponse: any[];
}
