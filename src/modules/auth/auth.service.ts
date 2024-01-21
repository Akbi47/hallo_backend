import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { USER_AUTH_CACHE_PREFIX, CLIENT_AUTH_CACHE_PREFIX, JWT_CONSTANTS } from 'src/modules/auth/auth.constants';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { ResponseLogin } from 'src/modules/auth/dto/response-login.dto';
import { ResponseRefreshTokenDto } from './dto/response-refresh-token.dto';
import { PayloadRefreshTokenDto } from './dto/payload-refresh-token.dto';
import { httpErrors } from 'src/shares/exceptions';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import * as config from 'config';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { UserFacebookInfoDto } from './dto/user-facebook-info.dto';
import { UserGoogleInfoDto } from './dto/user-google-info.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { validateHash } from 'src/shares/helpers/bcrypt';
import { User } from '../user/schemas/user.schema';
import { PayloadAccessTokenDto } from 'src/shares/dtos/payload-access-token.dto';
import { ClientService } from '../client/client.service';
import { Client } from '../client/schemas/client.schema';
import { UserService } from '../user/user.service';
const baseFacebookUrl = config.get<string>('facebook.graph_api');
const baseGoogleUrl = config.get<string>('google.base_api');
@Injectable()
export class AuthService {
  constructor(
    private clientService: ClientService,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async clientLogin(loginDto: LoginDto): Promise<ResponseLogin> {
    const { email, password } = loginDto;
    const client = await this.clientService.findOne({ email }, true);

    if (!client) {
      throw new BadRequestException(httpErrors.CLIENT_NOT_FOUND);
    }

    if (!(await validateHash(password, client.password))) {
      throw new UnauthorizedException(httpErrors.CLIENT_UNAUTHORIZED);
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateClientAccessToken(client),
      this.generateClientRefreshToken(client),
    ]);

    return {
      accessToken,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.clientAccessTokenExpiry,
    };
  }

  async userLogin(loginDto: LoginDto): Promise<ResponseLogin> {
    const { email, password } = loginDto;
    const user = await this.userService.findOne({ email }, true);

    if (!user) {
      throw new BadRequestException(httpErrors.ACCOUNT_NOT_FOUND);
    }

    if (!(await validateHash(password, user.password))) {
      throw new UnauthorizedException(httpErrors.UNAUTHORIZED);
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateUserAccessToken(user),
      this.generateUserRefreshToken(user),
    ]);

    return {
      accessToken,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.userAccessTokenExpiry,
      _id: user._id,
    };
  }

  async UserGetAccessToken(payload: PayloadRefreshTokenDto): Promise<ResponseRefreshTokenDto> {
    const { userId, refreshToken } = payload;
    const [user, oldRefreshToken] = await Promise.all([
      this.userService.findById(userId.toString()),
      this.cacheManager.get<string>(`${USER_AUTH_CACHE_PREFIX}${userId}`),
    ]);

    if (!user) throw new ForbiddenException();

    if (!oldRefreshToken) throw new HttpException(httpErrors.REFRESH_TOKEN_EXPIRED, HttpStatus.BAD_REQUEST);

    if (refreshToken === oldRefreshToken) {
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.generateUserAccessToken(user),
        this.generateUserRefreshToken(user),
      ]);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        iat: Date.now(),
        exp: Date.now() + JWT_CONSTANTS.userAccessTokenExpiry,
      };
    } else throw new HttpException(httpErrors.REFRESH_TOKEN_EXPIRED, HttpStatus.BAD_REQUEST);
  }

  async ClientGetAccessToken(payload: PayloadRefreshTokenDto): Promise<ResponseRefreshTokenDto> {
    const { userId, refreshToken } = payload;
    const [client, oldRefreshToken] = await Promise.all([
      this.clientService.findById(userId.toString()),
      this.cacheManager.get<string>(`${CLIENT_AUTH_CACHE_PREFIX}${userId}`),
    ]);

    if (!client) throw new ForbiddenException();

    if (!oldRefreshToken) throw new HttpException(httpErrors.REFRESH_TOKEN_EXPIRED, HttpStatus.BAD_REQUEST);

    if (refreshToken === oldRefreshToken) {
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.generateClientAccessToken(client),
        this.generateClientRefreshToken(client),
      ]);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        iat: Date.now(),
        exp: Date.now() + JWT_CONSTANTS.clientAccessTokenExpiry,
      };
    } else throw new HttpException(httpErrors.REFRESH_TOKEN_EXPIRED, HttpStatus.BAD_REQUEST);
  }

  async generateUserAccessToken(user: User): Promise<string> {
    const { role } = user;
    return this.jwtService.signAsync(
      {
        userId: user['_id'],
        role: role,
        date: Date.now(),
      },
      {
        secret: JWT_CONSTANTS.userAccessTokenSecret,
        expiresIn: JWT_CONSTANTS.userAccessTokenExpiry,
      },
    );
  }

  async generateClientAccessToken(client: Client): Promise<string> {
    const { role } = client;
    return this.jwtService.signAsync(
      {
        userId: client['_id'],
        role: role,
        date: Date.now(),
      },
      {
        secret: JWT_CONSTANTS.clientAccessTokenSecret,
        expiresIn: JWT_CONSTANTS.clientAccessTokenExpiry,
      },
    );
  }

  async generateUserRefreshToken(user: User): Promise<string> {
    const { role } = user;
    const refreshToken = await this.jwtService.signAsync(
      {
        userId: user['_id'],
        role: role,
        date: Date.now(),
      },
      {
        secret: JWT_CONSTANTS.userRefreshTokenSecret,
        expiresIn: JWT_CONSTANTS.userRefreshTokenExpiry,
      },
    );

    await this.cacheManager.set<string>(`${USER_AUTH_CACHE_PREFIX}${user['_id'].toString()}`, refreshToken, {
      ttl: JWT_CONSTANTS.userRefreshTokenExpiry,
    });

    return refreshToken;
  }

  async generateClientRefreshToken(user: Client): Promise<string> {
    const { role } = user;
    const refreshToken = await this.jwtService.signAsync(
      {
        userId: user['_id'],
        role: role,
        date: Date.now(),
      },
      {
        secret: JWT_CONSTANTS.clientRefreshTokenSecret,
        expiresIn: JWT_CONSTANTS.clientRefreshTokenExpiry,
      },
    );

    await this.cacheManager.set<string>(`${CLIENT_AUTH_CACHE_PREFIX}${user['_id']}`, refreshToken, {
      ttl: JWT_CONSTANTS.clientRefreshTokenExpiry,
    });

    return refreshToken;
  }

  async decodeAccessToken(accessToken: string): Promise<PayloadAccessTokenDto | any> {
    return this.jwtService.decode(accessToken);
  }

  async loginFacebook(loginFacebookDto: LoginFacebookDto): Promise<ResponseLogin> {
    const { accessToken } = loginFacebookDto;
    const url = `${baseFacebookUrl}me?fields=id,first_name,last_name,picture&access_token=${accessToken}`;
    const userData: UserFacebookInfoDto = await lastValueFrom(
      this.httpService
        .get(url)
        .pipe(
          map((response) => {
            return response.data || null;
          }),
        )
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.message);
          }),
        ),
    );

    if (!userData) {
      throw new BadRequestException(httpErrors.FACEBOOK_TOKEN_INVALID_OR_EXPIRES);
    }

    const client = await this.clientService.findOrCreateFacebookUser(userData);
    const [accessToken_, refreshToken] = await Promise.all([
      this.generateClientAccessToken(client['_id']),
      this.generateClientRefreshToken(client['_id']),
    ]);

    return {
      accessToken: accessToken_,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.clientAccessTokenExpiry,
    };
  }

  async logInGoogle(loginGoogleDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginGoogleDto;
    const url = `${baseGoogleUrl}userinfo?access_token=${accessToken}`;

    const userData: UserGoogleInfoDto = await lastValueFrom(
      this.httpService
        .get(url)
        .pipe(
          map((response) => {
            return response || null;
          }),
        )
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.message);
          }),
        ),
    );

    if (!userData) {
      throw new BadRequestException(httpErrors.GOOGLE_TOKEN_INVALID_OR_EXPIRES);
    }

    const client = await this.clientService.findOrCreateGoogleUser(userData);
    const [accessToken_, refreshToken] = await Promise.all([
      this.generateClientAccessToken(client['_id']),
      this.generateClientRefreshToken(client['_id']),
    ]);

    return {
      accessToken: accessToken_,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.clientAccessTokenExpiry,
    };
  }
}
