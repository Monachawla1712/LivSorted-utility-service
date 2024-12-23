class OrderContactDetails {
  name: string;
  phone: string;
}

class Metadata {
  contactDetail: OrderContactDetails = new OrderContactDetails();
}

class OfferData {
  voucherCode: number;
}

class SortedOrderItemMetadata {
  productName: string;
  pieces: number;
}

class OrderItems {
  skuCode: string;
  quantity: number;
  discountAmount: number;
}

export class InternalOrderSyncDto {
  id: string;
  customerId: string;
  storeId: string;
  channel: string;
  deliveryAddress: number;
  shippingMethod: string;
  paymentMethod: string;
  status: string;
  notes: string;
  submittedAt: string;
  metadata: Metadata = new Metadata();
  offerData: OfferData;
  orderItems: OrderItems[];
}
