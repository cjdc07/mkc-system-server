export class CreateOrderDto {
  customerName: string;
  customerEmail: string;
  customerContact: string;
  customerAddress: string;
  forDelivery: boolean;
  deliveryDate: Date;
  productOrder: any;
}
