import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/http-exception.filter';
import { LithosOrderDto } from './dto/lithos.dto';
import { SortedOrderDto } from './dto/sorted-order.dto';
import { LithosIntegrationService } from './lithos-integration.service';
import { WhitelistSkipValidation } from '../common/validation.pipeline';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';

@Controller('integration/lithos')
@ApiTags('Lithos Callbacks')
@UseFilters(HttpExceptionFilter)
@UsePipes(WhitelistSkipValidation)
export class LithosIntegrationController {
  private readonly logger = new CustomLogger(LithosIntegrationController.name);
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private lithosIntegrationService: LithosIntegrationService,
  ) {}

  @ApiBody({ type: LithosOrderDto })
  @Post('updates')
  lithosOrder(@Body() order: LithosOrderDto) {
    return { success: true };
    // push to pubsub
    // return this.lithosIntegrationService.lithosOrderToSorted(order);
  }
}

@Controller('internal/lithos')
@ApiTags('Internal Integration apis - lithos')
@UseFilters(HttpExceptionFilter)
@UsePipes(WhitelistSkipValidation)
export class LithosInternalIntegrationController {
  constructor(private lithosIntegrationService: LithosIntegrationService) {}

  @ApiBody({ type: SortedOrderDto })
  @Post('create')
  sortedOrder(@Body() order: SortedOrderDto) {
    return { success: true };
    // push to pubsub
    // return this.lithosIntegrationService.sortedOrderToLithos(order);
  }

  @ApiBody({ type: SortedOrderDto })
  @Post('payment-update')
  paymentUpdate(@Body() order: SortedOrderDto) {
    return;
    // return this.lithosIntegrationService.sendPaymentUpdateToLithos(order);
  }

  @Get('store/:storeId')
  async getLithosStoreCatalogue(@Param('storeId') storeId: string) {
    let catalogueList = [];
    const catagoryIdList = [1, 2, 3];
    for (const categoryId of catagoryIdList) {
      const categoryList =
        await this.lithosIntegrationService.getLithosCatalogueFromCatagory(
          storeId,
          categoryId,
        );
      catalogueList = catalogueList.concat(categoryList);
    }
    return { catalogueList: catalogueList };
  }
}
