import { AuthGuard } from '@nestjs/passport';

export class ClientAtGuards extends AuthGuard('client-jwt') {
  constructor() {
    super();
  }
}
