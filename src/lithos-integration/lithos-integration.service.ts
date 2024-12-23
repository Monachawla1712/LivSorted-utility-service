import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { LithosOrderDto } from './dto/lithos.dto';
import { SortedOrderDto } from './dto/sorted-order.dto';
import { Config } from 'src/config/configuration';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';
import { PaymentNotifyObjectDto } from './dto/paymentNotifyObject.dto';
import { CustomLogger } from '../common/custom-logger';
import { AsyncContext } from '@nestjs-steroids/async-context';

const STATUS_MAP_LITHOS_SORTED = {
  confirmed: 'ORDER_ACCEPTED_BY_STORE',
  pending: 'NEW_ORDER',
  ready: 'ORDER_BILLED',
  pickedup: 'ORDER_OUT_FOR_DELIVERY',
  completed: 'ORDER_DELIVERED',
  delivered: 'ORDER_DELIVERED',
  void: 'ORDER_CANCELLED_BY_STORE',
  canceled: 'ORDER_CANCELLED_BY_CUSTOMER',
};

const PAYMENT_MAP_LITHOS_SORTED = {
  1: 'Cash',
  2: 'Bank/Card',
  3: 'Mosambee(Android)',
  4: 'UPI',
  7: 'PhonePe(UPI)',
  11: 'Razo Pay',
  17: 'Pine Labs',
  19: 'ezetap',
  22: 'PhonePe(UPI Static QR)',
  61: 'Test Nitin UPI',
  62: 'PhonePe',
  63: 'Online',
};

const phoneNumberRegex = new RegExp(/^[6-9]\d{9}$/);

@Injectable()
export class LithosIntegrationService {
  private readonly logger = new CustomLogger(LithosIntegrationService.name);
  constructor(
    private readonly asyncContext: AsyncContext<string, string>,
    private configService: ConfigService<Config, true>,
    private readonly httpService: HttpService,
  ) {}

  async getUser(phone_number_full: string) {
    try {
      if (phone_number_full && phone_number_full.length) {
        phone_number_full = phone_number_full.slice(-10);
        if (!phone_number_full.match(phoneNumberRegex))
          phone_number_full = null;
      } else {
        phone_number_full = null;
      }
      const user = await firstValueFrom(
        this.httpService.request({
          method: 'post',
          baseURL: this.configService.get('authServiceBaseUrl'),
          url: '/auth/internal/user',
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
          data: {
            phone_number: phone_number_full
              ? phone_number_full.slice(-10)
              : null,
          },
        }),
      );
      return user.data;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while getAndCreateUser',
        e,
      );
      throw new Error('FAILED_TO_CREATE_USER');
    }
  }

  async getUserById(id: string) {
    try {
      const user = await firstValueFrom(
        this.httpService.request({
          method: 'get',
          baseURL: this.configService.get('authServiceBaseUrl'),
          url: `/auth/internal/user/${id}`,
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
        }),
      );
      return user.data;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while getUserById',
        e,
      );
      throw new Error('FAILED_TO_CREATE_USER');
    }
  }

  async getAddressByLithosId(address, userId) {
    try {
      const sortedAddress = await firstValueFrom(
        this.httpService.request({
          method: 'get',
          baseURL: this.configService.get('authServiceBaseUrl'),
          url: `/auth/internal/addresses/ref/${address.ID}`,
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
        }),
      );
      return sortedAddress.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message: string };

        if (data.message === 'Ref not found')
          return this.createAddress(address, userId);
      }
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while getAddressByLithosId',
        e,
      );
      throw new Error('FAILED_TO_CREATE_USER');
    }
  }

  async getAddressById(id: number) {
    try {
      const sortedAddress = await firstValueFrom(
        this.httpService.request({
          method: 'get',
          baseURL: this.configService.get('authServiceBaseUrl'),
          url: `/auth/internal/addresses/${id}`,
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
        }),
      );
      return sortedAddress.data;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while getAddressById',
        e,
      );
      throw new Error('FAILED_TO_GET_ADDRESS_BY_ID');
    }
  }

  async createAddress(address, user_id) {
    try {
      const sortedAddress = await firstValueFrom(
        this.httpService.request({
          method: 'post',
          baseURL: this.configService.get('authServiceBaseUrl'),
          url: `/auth/internal/addresses`,
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
          data: {
            address_line_1: address.Address || 'NO_ADDRESS',
            address_line_2: address.FlatNo,
            house: address.Address || 'NO_ADDRESS',
            street: address.FlatNo,
            society: address.Address || null,
            type: 'HOME',
            sector: 'NO_CITY',
            lithos_ref: address.ID,
            city: 'NO_CITY',
            contact_number: address.Phone,
            landmark: address.Address || null,
            pincode: parseInt(address.ZIP),
            state: 'NO_STATE',
            lat: address.Latitude || 28.4458,
            long: address.Longitude || 77.0469,
            user_id,
          },
        }),
      );
      return sortedAddress.data;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while createAddress',
        e,
      );
      throw new Error('FAILED_TO_CREATE_ADDRESS');
    }
  }

  async getStore(params) {
    try {
      const store = await firstValueFrom(
        this.httpService.request({
          method: 'get',
          baseURL: this.configService.get('storeServiceBaseUrl'),
          url: '/store-app/internal/store',
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
          params,
        }),
      );
      return store.data[0];
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while getStore with param-> ' +
          JSON.stringify(params),
        e,
      );
      throw new Error('FAILED_TO_GET_STORE');
    }
  }
  async getSkus(params) {
    try {
      const skus = await firstValueFrom(
        this.httpService.request({
          method: 'get',
          baseURL: this.configService.get('storeServiceBaseUrl'),
          url: '/store-app/internal/products',
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
          params,
        }),
      );
      return skus.data;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while getSkus with param->' +
          JSON.stringify(params),
        e,
      );
      throw new Error('FAILED_TO_GET_STORE');
    }
  }

  async sendOrderToLithos(user, address, store, skus, order) {
    const data = {
      customer: {
        phone: `+91${user.phone_number}`,
        name: user.name || 'user',
      },
      deliveryAddress: {},
      type: 'delivery',
      note: order.notes,
      channelOrderId: order.id,
      discounts: [],
      items: order.orderItems.map((i) => {
        return {
          id: skus[i.skuCode],
          qty: i.finalQuantity,
          saleRate: i.salePrice,
          amount: i.salePrice * i.finalQuantity,
          item: i.skuCode,
        };
      }),
      payType: 0,
      payId: 0,
    };
    // optional fields
    if (order.offerData != null && order.totalDiscountAmount != null) {
      if (order.offerData.lithosRefId != null) {
        data.discounts = [
          {
            id: order.offerData.lithosRefId,
            amount: order.totalDiscountAmount,
          },
        ];
      }
    }
    if (address) {
      const deliveryAddress = {
        id: address.lithos_ref,
        name: address.name || user.name || 'name',
        phone: `+91${address.contact_number}`,
        address: address.address_line_1,
        zip: address.zip ? address.zip.toString() : '400031',
        flatNo: address.address_line_2 || 'APH',
        email: 'no-reply@sorted.team',
        latitude: address.lat,
        longitude: address.long,
      };
      if (!deliveryAddress.id) delete deliveryAddress.id;
      data.deliveryAddress = deliveryAddress;
    } else delete data.deliveryAddress;

    try {
      const resp = await firstValueFrom(
        this.httpService.request({
          method: 'post',
          baseURL: this.configService.get('lithosBaseUrl'),
          url: `/${store.lithos_ref}/order`,
          headers: {
            key: this.configService.get('lithosKey'),
            keyId: this.configService.get('lithosUser'),
          },
          data,
        }),
      );
      if (store.id == '10001') {
        this.logger.log(
          this.asyncContext.get('traceId'),
          'sendOrderToLithos' + JSON.stringify(data),
        );
      }
      return resp.data;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while sendOrderToLithos with data->' +
          JSON.stringify(data),
        e,
      );
    }
  }
  async sortedOrderToLithos(order: SortedOrderDto) {
    this.logger.log(
      this.asyncContext.get('traceId'),
      'orderFromSorted' + JSON.stringify(order),
    );
    const user = await this.getUserById(order.customerId);
    const address = order.deliveryAddress
      ? await this.getAddressById(order.deliveryAddress)
      : null;
    const store = await this.getStore({ store_id: order.storeId });
    const sku_code = order.orderItems.map((orderItem) => orderItem.skuCode);
    const skus = await this.getSkus({ sku_code: sku_code.join(',') });
    const sku_map = {};
    skus.map((s) => {
      sku_map[s.sku_code] = s.lithos_ref;
      return;
    });

    order.orderItems.forEach((orderItem) => {
      if (
        orderItem.metadata != null &&
        orderItem.metadata.productName != null &&
        orderItem.metadata.pieces != null
      ) {
        if (order.notes == null) {
          order.notes = '';
        }
        order.notes +=
          ' ' +
          orderItem.metadata.productName +
          ' ' +
          orderItem.metadata.pieces +
          ' ';
      }
    });

    if (order.notes == null) {
      order.notes = '';
    }

    if (address != null) {
      order.notes += '| Delivery Address: ';
      if (address.address_line_1 != null) {
        order.notes += address.address_line_1 + ',';
      }
      if (address.address_line_2 != null) {
        order.notes += address.address_line_2 + ',';
      }
      if (address.landmark != null) {
        order.notes += address.landmark + ',';
      }
      if (address.city != null) {
        order.notes += address.city + ' ';
      }
    }

    this.logger.log(this.asyncContext.get('traceId'), JSON.stringify(order));

    const resp = await this.sendOrderToLithos(
      user,
      address,
      store,
      sku_map,
      order,
    );
    this.logger.log(
      this.asyncContext.get('traceId'),
      'sortedOrderToLithos' + JSON.stringify(resp),
    );
    return { success: true };
  }

  async sendPaymentUpdateToLithos(order: SortedOrderDto) {
    const data = {
      payId: 63,
    };
    const store = await this.getStore({ store_id: order.storeId });
    try {
      const resp = await firstValueFrom(
        this.httpService.request({
          method: 'post',
          baseURL: this.configService.get('lithosBaseUrl'),
          url: `/${store.lithos_ref}/order/payment/${order.lithosOrderId}`,
          headers: {
            key: this.configService.get('lithosKey'),
            keyId: this.configService.get('lithosUser'),
          },
          data,
        }),
      );
      if (store.id == '10001') {
        this.logger.log(
          this.asyncContext.get('traceId'),
          'sendPaymentUpdateToLithos' + JSON.stringify(data),
        );
      }
      return resp.data;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while sendPaymentUpdateToLithos with data->' +
          JSON.stringify(data),
        e,
      );
    }
  }

  async getPaymentDetailsFromMap(
    order: LithosOrderDto,
  ): Promise<PaymentNotifyObjectDto> {
    if (
      order == null ||
      order.ReceiptList == null ||
      order.ReceiptList.length === 0 ||
      order.ReceiptList[0].PayId === 0
    ) {
      return null;
    }
    const paymentNotifyBean = new PaymentNotifyObjectDto();
    paymentNotifyBean.paymentMode =
      PAYMENT_MAP_LITHOS_SORTED[order.ReceiptList[0].PayId];
    paymentNotifyBean.orderAmount = order.ReceiptList[0].Amount.toString();
    paymentNotifyBean.orderId = order.ChannelOrderId;

    paymentNotifyBean.referenceId =
      order.ID != null ? order.ID.toString() : null;
    paymentNotifyBean.txStatus = 'SUCCESS';
    paymentNotifyBean.paymentGatewayResponse = order.ReceiptList;
    return paymentNotifyBean;
  }

  async sendOrderToSorted(user, address, store, skus, order: LithosOrderDto) {
    const data = {
      id: order.ChannelOrderId,
      lithosOrderId: order.ID,
      customerId: user.id,
      storeId: store.store_id,
      finalBillAmount: order.TotalAmount,
      totalDiscountAmount: order.DiscountAmount,
      totalSpGrossAmount: order.TotalAmount - order.DiscountAmount,
      paymentMethod: 'CASH',
      shippingMethod: 'STORE_PICKUP',
      status: STATUS_MAP_LITHOS_SORTED[order.Status],
      deliveryAddress: address.id || null,
      notes: order.note,
      channel: 'Walkin',
      metadata: {
        contactDetails: {
          name: order.DeliveryAddress.Name,
          phone: order.DeliveryAddress.Phone,
        },
      },
      payment: await this.getPaymentDetailsFromMap(order),
      orderItems: order.CartList.map((orderItem) => {
        return {
          finalQuantity: orderItem.Qty,
          salePrice: orderItem.Sale_Rate,
          skuCode: skus[orderItem.ID],
          spGrossAmount: orderItem.Qty * orderItem.Sale_Rate,
          finalAmount: orderItem.GrandAmount,
          discountAmount: 0,
        };
      }),
    };
    try {
      let method = 'PUT';
      if (!order.ChannelOrderId || order.ChannelOrderId === '') {
        method = 'POST';
        delete data.id;
      }
      const resp = await firstValueFrom(
        this.httpService.request({
          method,
          baseURL: this.configService.get('orderServiceBaseUrl'),
          url: `/orders/lithos`,
          headers: {
            Authorization: `Bearer ${this.configService.get('internalToken')}`,
          },
          data,
        }),
      );
      return resp.data;
    } catch (e) {
      this.logger.error(
        this.asyncContext.get('traceId'),
        'Something went wrong while sendOrderToSorted with data->' +
          JSON.stringify(data),
        e,
      );
    }
  }
  async lithosOrderToSorted(order: LithosOrderDto) {
    this.logger.log(
      this.asyncContext.get('traceId'),
      'orderFromLithos' + JSON.stringify(order),
    );
    try {
      const user = await this.getUser(order.Customer.Mobile);
      const address = order.DeliveryAddress.ID
        ? await this.getAddressByLithosId(order.DeliveryAddress, user.id)
        : {};
      const store = await this.getStore({ lithos_ref: order.Store.ID });
      const lithos_refs = order.CartList.map((cartItem) => cartItem.ID);

      // error cases
      const skus = await this.getSkus({ lithos_ref: lithos_refs.join(',') });

      const sku_map = {};
      skus.map((sku) => {
        sku_map[sku.lithos_ref] = sku.sku_code;
        return;
      });
      const resp = await this.sendOrderToSorted(
        user,
        address,
        store,
        sku_map,
        order,
      );
      this.logger.log(
        this.asyncContext.get('traceId'),
        'lithosOrderToSorted' + JSON.stringify(resp),
      );
      return { success: true };
    } catch (e) {
      return { success: true };
    }
  }

  async getLithosCatalogueFromCatagory(storeId: string, categoryId: number) {
    const resp = await firstValueFrom(
      this.httpService.request({
        method: 'post',
        baseURL: this.configService.get('lithosBaseUrl'),
        url: `/${storeId}/items/${categoryId}`,
        params: { offset: 0, limit: 500 },
        headers: {
          key: this.configService.get('lithosKey'),
          keyId: this.configService.get('lithosUser'),
        },
        data: { item: '' },
      }),
    );
    return resp.data.items;
  }
}
