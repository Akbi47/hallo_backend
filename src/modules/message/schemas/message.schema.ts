import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { Transform } from 'class-transformer';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { CONVERSATIONS_MODEL } from './conversation.schema';
export const MESSAGES_MODEL = 'messages';

@Schema({ timestamps: true, collection: MESSAGES_MODEL })
export class Message {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.ObjectId,
    ref: USER_MODEL,
  })
  sender_id: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.ObjectId,
    ref: CONVERSATIONS_MODEL,
  })
  conversation_id: string;

  @Prop({ type: String })
  content: string;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.virtual('sender', {
  ref: USER_MODEL,
  localField: 'sender_id',
  foreignField: '_id',
  justOne: true,
});

MessageSchema.virtual('conversation', {
  ref: USER_MODEL,
  localField: 'conversation_id',
  foreignField: '_id',
  justOne: true,
});
