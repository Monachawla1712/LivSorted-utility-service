import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';

const metaKeys = [
  'administrative_area_level_1',
  'administrative_area_level_2',
  'postal_code',
];

// TODO: ERRORS
@Injectable()
export class MapService {
  private readonly logger = new CustomLogger(MapService.name);
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private configService: ConfigService<Config, true>,
    private readonly httpService: HttpService,
  ) {}

  async cordinatesFromPlaceId(placeId: string) {
    try {
      const geo = await firstValueFrom(
        this.httpService.request({
          method: 'get',
          url: 'https://maps.googleapis.com/maps/api/geocode/json',
          params: {
            place_id: placeId,
            key: this.configService.get('googleMapApiKey'),
          },
        }),
      );
      // console.log(geo.data);
      // TODO:: propogate this error to user if required
      if (!geo.data.results.length)
        throw new BadRequestException('PLACE_NOT_FOUND');

      const address = geo.data.results[0];
      const meta = {};
      address.address_components.map((component) => {
        component.types.map((type) => {
          if (metaKeys.indexOf(type) > -1) meta[type] = component.long_name;
        });
      });
      return {
        address_line: address.formatted_address,
        lat: address.geometry.location.lat,
        long: address.geometry.location.lng,
        meta,
      };
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while fetching coordinates from place id',
        e,
      );
      throw new BadRequestException('PLACE_ID_INVALID');
    }
  }

  async addressFromCordinates(lat: number, long: number) {
    try {
      const geo = await firstValueFrom(
        this.httpService.request({
          method: 'get',
          url: 'https://maps.googleapis.com/maps/api/geocode/json',
          params: {
            latlng: `${lat},${long}`,
            key: this.configService.get('googleMapApiKey'),
          },
        }),
      );
      // console.log(JSON.stringify(geo.data.results[0]), 4, null);
      // TODO:: propogate this error to user if required
      if (!geo.data.results.length)
        throw new BadRequestException('PLACE_NOT_FOUND');

      const address = geo.data.results[0];
      const meta = {};
      address.address_components.map((component) => {
        component.types.map((type) => {
          if (metaKeys.indexOf(type) > -1) meta[type] = component.long_name;
        });
      });
      return {
        address_line: address.formatted_address,
        lat: address.geometry.location.lat,
        long: address.geometry.location.lng,
        placeId: address.place_id,
        meta,
      };
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while fetching address from coordinates',
        e,
      );
      throw new BadRequestException('CORDINATES_INVALID');
    }
  }

  async autoComplete(input: string) {
    const places = await firstValueFrom(
      this.httpService.request({
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        params: {
          input: input,
          // location: `28.567637712798664%2C77.200927734375`,
          // radius: 150000,
          components: 'country:in',
          key: this.configService.get('googleMapApiKey'),
        },
      }),
    );
    //if (places.status == 1) return { predictions: [] };
    //console.log(places.data);
    return places.data.predictions.map((p) => {
      return { description: p.description, placeId: p.place_id };
    });
  }

  async coordinatesFromText(input: string) {
    try {
      const geo = await firstValueFrom(
        this.httpService.request({
          method: 'get',
          url: 'https://maps.googleapis.com/maps/api/geocode/json',
          params: {
            address: input,
            components: 'country:in',
            key: this.configService.get('googleMapApiKey'),
          },
        }),
      );

      if (!geo.data.results.length)
        throw new BadRequestException('PLACE_NOT_FOUND');

      const address = geo.data.results[0];
      const meta = {};
      address.address_components.map((component) => {
        component.types.map((type) => {
          if (metaKeys.indexOf(type) > -1) meta[type] = component.long_name;
        });
      });
      return {
        address_line: address.formatted_address,
        lat: address.geometry.location.lat,
        long: address.geometry.location.lng,
        placeId: address.place_id,
        meta,
      };
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while fetching coordinates from text',
        e,
      );
      throw new BadRequestException('ADDRESS_INVALID');
    }
  }
}
