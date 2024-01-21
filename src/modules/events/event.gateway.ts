import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { PayloadAccessTokenDto } from 'src/shares/dtos/payload-access-token.dto';
import { MessageService } from '../message/message.service';
import { SendMessageDto } from './dto/send-message.dto';
const room = 'my-room';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebSocketGateway');

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  afterInit(): void {
    console.log('init socket success');
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket): Promise<void> {
    const accessToken = client.handshake.headers?.authorization?.split(' ')[1] || '';
    if (accessToken) {
      try {
        const payload: PayloadAccessTokenDto = await this.authService.decodeAccessToken(accessToken);

        if (!payload || !payload.userId) {
          client.disconnect(true);
        }
        const user = await this.userService.findById(payload.userId);

        if (!user) {
          client.disconnect(true);
        }

        const expTime = payload.exp;
        const currentDate = Math.floor(Date.now() / 1000);

        if (currentDate > expTime) {
          client.disconnect(true);
        }

        client.userId = user._id;
      } catch (e) {
        this.logger.log(e);
        this.logger.log(`Failed to decode access token for client ${client.id}`);
      }
    } else {
      client.disconnect(true);
      this.logger.log(`Guest disconnected: ${client.id}`);
    }

    client.on('leave', (symbol: string) => {
      this.logger.log(`Client ${client.id} leave ${symbol} `);
      client.leave('default_room');
    });

    client.on('join', (symbol: string) => {
      this.logger.log(`Client ${client.id} join ${symbol} `);
      client.join(['default_room']);
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, data: SendMessageDto): Promise<void> {
    const message = await this.messageService.createMessage({
      sender_id: socket.userId,
      conversation_id: data.conversationId,
      content: data.content,
    });

    this.server.to(data.conversationId).emit('newMessage', message);
  }

  @SubscribeMessage('chatRoom')
  handleChatRoom(client: Socket, message: string): void {
    this.server.to(room).emit(`chatRoom`, message);
  }
}
