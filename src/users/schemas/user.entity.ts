import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    default: 'Viewer',
    enum: ['Owner', 'Editor', 'Viewer'],
  })
  role: string;

  @Prop({ default: true })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
