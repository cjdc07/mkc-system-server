import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';

export type ProductChangeHistoryDocument = ProductChangeHistory & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  timestamps: true,
})
export class ProductChangeHistory {
  @Prop()
  descriptions: [string];

  @Prop({
    default: 'New Product',
    enum: ['New Product', 'Order', 'Manual Update'],
  })
  createdFrom: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  changes: any;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  changedBy: User;
}

export const ProductChangeHistorySchema =
  SchemaFactory.createForClass(ProductChangeHistory);
