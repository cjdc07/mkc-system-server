export class CreateOrderDto {
  customerName: string;
  customerEmail: string;
  customerContact: string;
  customerAddress: string;
  forDelivery: boolean;
  deliveryDate: Date;
  productOrders: [any];
  paymentMethod: string;
  paymentDueDate: Date;
  initialPayment: number;
}
