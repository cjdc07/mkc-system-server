import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';

export type ProductChangeHistoryDocument = ProductChangeHistory & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  timestamps: true,
})
export class ProductChangeHistory {
  @Prop()
  description: string;

  @Prop({
    default: 'New Product',
    enum: ['New Product', 'Order', 'Manual Update'],
  })
  createdFrom: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  product: Product;
}

export const ProductChangeHistorySchema =
  SchemaFactory.createForClass(ProductChangeHistory);
