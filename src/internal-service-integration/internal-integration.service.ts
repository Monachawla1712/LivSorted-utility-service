import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';
import { firstValueFrom } from 'rxjs';
import { InternalOrderSyncDto } from './dto/internal-order-sync.dto';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';

@Injectable()
export class InternalIntegrationService {
  private readonly logger = new CustomLogger(InternalIntegrationService.name);
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private configService: ConfigService<Config, true>,
    private readonly httpService: HttpService,
  ) {}

  async createUser(phoneNumber, name, pincode, email, address) {
    try {
      const user = await firstValueFrom(
        this.httpService.request({
          method: 'post',
          baseURL: this.configService.get('authServiceBaseUrl'),
          url: '/auth/user/pos/create',
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
          data: {
            phone_number: phoneNumber,
            name: name,
            pincode: pincode,
            email: email,
            address: address,
          },
        }),
      );
      return user.data.user;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while getAndCreateUser',
        e,
      );
      throw new Error('FAILED_TO_CREATE_USER');
    }
  }

  async sendOrderRequest(orderRequest: InternalOrderSyncDto): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: 'POST',
          baseURL: this.configService.get('orderServiceBaseUrl'),
          url: `/orders/internal/pos`,
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
          data: orderRequest,
        }),
      );
      this.logger.log(this.asyncContext.get('traceId'), response.data);
      return true;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while sending pos order request',
        e,
      );
      return false;
    }
  }
}
