import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  pricePerUnit: number;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: 'pc/s' })
  unit: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
