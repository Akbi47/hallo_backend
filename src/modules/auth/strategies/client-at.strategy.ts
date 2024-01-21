import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONSTANTS } from '../auth.constants';
import express from 'express';
import { AuthService } from '../auth.service';
import { httpErrors } from 'src/shares/exceptions';
import { PayloadAccessTokenDto } from 'src/shares/dtos/payload-access-token.dto';
import { ClientService } from 'src/modules/client/client.service';

@Injectable()
export class ClientAtStrategy extends PassportStrategy(Strategy, 'client-jwt') {
  constructor(private readonly clientService: ClientService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_CONSTANTS.clientAccessTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: express.Request, args: PayloadAccessTokenDto): Promise<any> {
    const accessToken = req.headers['authorization']?.split(' ')[1] || '';
    const authenticatedUser = await this.authService.decodeAccessToken(accessToken);
    if (!authenticatedUser) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const client = await this.clientService.findById(args.userId);
    if (!client) {
      throw new UnauthorizedException();
    }

    if (client.is_banned) {
      throw new UnauthorizedException(httpErrors.CLIENT_BANNED);
    }

    if (!client.is_verify) {
      throw new UnauthorizedException(httpErrors.CLIENT_UNVERIFIED);
    }

    return client;
  }
}
