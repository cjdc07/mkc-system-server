import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  timestamps: true,
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
}

export const ProductSchema = SchemaFactory.createForClass(Product);
