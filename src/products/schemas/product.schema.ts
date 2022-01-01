import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

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

  @Prop({ default: 'pc' })
  unit: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
