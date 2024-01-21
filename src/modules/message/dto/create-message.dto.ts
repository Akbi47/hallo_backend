import { IsDefined, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsDefined()
  @IsMongoId()
  sender_id: string;

  @IsDefined()
  @IsMongoId()
  conversation_id: string;
  content: string;
}
