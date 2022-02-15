import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type OrderDocument = Order & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  timestamps: true,
})
export class Order {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  customerName: string;

  @Prop()
  customerEmail: string;

  @Prop()
  customerContact: string;

  @Prop()
  customerAddress: string;

  @Prop({ default: false })
  forDelivery: boolean;

  @Prop()
  deliveryDate: Date;

  // Props should only be id, price, quantity, total
  @Prop([{ type: MongooseSchema.Types.Mixed }])
  productOrders: [any];

  @Prop({
    default: 'Preparing',
    enum: [
      'Preparing',
      'For Delivery',
      'For Payment',
      'Completed',
      'Cancelled',
    ],
  })
  status: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
