import {
  Body,
  Controller,
  Post,
  UseFilters,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../common/http-exception.filter';
import {
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { MapService } from './maps.service';
import { CordinatesDto, AddressDto, AutoCompleteDto } from './dto/geo.dto';
import {
  AddressResponseDto,
  PlaceNotFoundDto,
  Prediction,
} from './dto/geo.responses.dto';
import { WhitelistErrorValidation } from '../common/validation.pipeline';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';

@UsePipes(WhitelistErrorValidation)
@Controller('geo')
@ApiTags('Locations')
@ApiBearerAuth()
@UseFilters(HttpExceptionFilter)
export class MapsController {
  private readonly logger = new CustomLogger(MapsController.name);
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private mapService: MapService,
  ) {}

  @ApiOperation({
    summary:
      'Address and additional info from a placeId (placeId can be found with autocomplete api)',
  })
  @ApiBody({ type: CordinatesDto })
  @Post('cordinates')
  @ApiResponse({ status: 200, type: AddressResponseDto })
  @ApiResponse({ status: 400, type: PlaceNotFoundDto })
  @HttpCode(200)
  cordinates(@Body() place: CordinatesDto) {
    return this.mapService.cordinatesFromPlaceId(place.placeId);
  }

  @ApiOperation({
    summary: 'Address and additional info from lat and long',
  })
  @ApiBody({ type: AddressDto })
  @ApiResponse({ status: 200, type: AddressResponseDto })
  @ApiResponse({ status: 400, type: PlaceNotFoundDto })
  @Post('address')
  @HttpCode(200)
  address(@Body() address: AddressDto) {
    return this.mapService.addressFromCordinates(address.lat, address.long);
  }

  @ApiOperation({
    summary: 'Address prediction by input keystrokes',
  })
  @ApiBody({ type: AutoCompleteDto })
  @Post('auto-complete')
  @ApiResponse({ status: 200, type: [Prediction] })
  @HttpCode(200)
  autoComplete(@Body() address: AutoCompleteDto) {
    return this.mapService.autoComplete(address.input);
  }

  @ApiOperation({
    summary: 'Address coordinates from an address text',
  })
  @ApiBody({ type: AutoCompleteDto })
  @Post('coordinates')
  @ApiResponse({ status: 200, type: AddressResponseDto })
  @ApiResponse({ status: 400, type: PlaceNotFoundDto })
  @HttpCode(200)
  coordinates(@Body() address: AutoCompleteDto) {
    return this.mapService.coordinatesFromText(address.input);
  }
}
