import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async createMessage(messageDto: CreateMessageDto): Promise<Message> {
    const { sender_id, conversation_id, content } = messageDto;
    return this.messageModel.create({
      sender_id,
      conversation_id,
      content,
    });
  }
}
