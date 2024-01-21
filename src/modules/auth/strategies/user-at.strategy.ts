import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONSTANTS } from '../auth.constants';
import express from 'express';
import { AuthService } from '../auth.service';
import { UserService } from 'src/modules/user/user.service';
import { httpErrors } from 'src/shares/exceptions';
import { PayloadAccessTokenDto } from 'src/shares/dtos/payload-access-token.dto';

@Injectable()
export class UserAtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_CONSTANTS.userAccessTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: express.Request, args: PayloadAccessTokenDto): Promise<any> {
    const accessToken = req.headers['authorization']?.split(' ')[1] || '';
    const authenticatedUser = await this.authService.decodeAccessToken(accessToken);
    if (!authenticatedUser) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    const user = await this.userService.findById(args.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.is_banned) {
      throw new UnauthorizedException(httpErrors.USER_BANNED);
    }

    if (!user.is_verify) {
      throw new UnauthorizedException(httpErrors.USER_UNVERIFIED);
    }

    return user;
  }
}
