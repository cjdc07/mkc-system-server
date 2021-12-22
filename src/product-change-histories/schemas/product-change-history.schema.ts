import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';

export type ProductChangeHistoryDocument = ProductChangeHistory & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class ProductChangeHistory {
  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: 0 })
  quantityChange: number;

  @Prop({ default: 'Creation', enum: ['Creation', 'Order', 'Manual Update'] })
  type: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  product: Product;
}

export const ProductChangeHistorySchema =
  SchemaFactory.createForClass(ProductChangeHistory);
