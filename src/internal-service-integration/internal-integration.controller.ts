import {
  Body,
  Controller,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/http-exception.filter';
import { PosOrderSyncDto } from './dto/pos-order-sync.dto';
import { InternalIntegrationService } from './internal-integration.service';
import { InternalOrderSyncDto } from './dto/internal-order-sync.dto';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';

@Controller()
@UseFilters(HttpExceptionFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
export class InternalIntegrationController {
  private readonly logger = new CustomLogger(
    InternalIntegrationController.name,
  );
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private internalIntegrationService: InternalIntegrationService,
  ) {}

  @ApiBody({ type: PosOrderSyncDto })
  @Post('sync/order')
  async syncPosOrder(@Body() order: PosOrderSyncDto) {
    const user = await this.internalIntegrationService.createUser(
      order.phoneNumber,
      order.customerName,
      order.pincode,
      order.email,
      order.address,
    );

    const orderRequest = new InternalOrderSyncDto();
    Object.assign(orderRequest, order);
    orderRequest.storeId = order.storeId;
    orderRequest.customerId =
      order.customerId != null ? order.customerId : user.id;
    if (user != null) {
      orderRequest.metadata.contactDetail.name = user.name;
      orderRequest.metadata.contactDetail.phone = order.phoneNumber;
    }

    const success = await this.internalIntegrationService.sendOrderRequest(
      orderRequest,
    );
    return { success: success };
  }
}
