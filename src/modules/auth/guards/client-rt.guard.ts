import { AuthGuard } from '@nestjs/passport';

export class ClientRtGuards extends AuthGuard('client-jwt-refresh') {
  constructor() {
    super();
  }
}
