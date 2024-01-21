import { CACHE_MANAGER, Inject, Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { SignUpCacheInterface, SignUpDto } from './dto/sign-up.dto';
import { randomCodeNumber } from 'src/shares/helpers/utils';
import { GetClientDto } from './dto/get-client.dto';
import { Cache } from 'cache-manager';
import { SignUpByCodeDto } from './dto/sign-up-by-code.dto';
import { FORGOT_PASSWORD_CACHE, FORGOT_PASSWORD_EXPIRY, SIGN_UP_CACHE, SIGN_UP_EXPIRY } from '../auth/auth.constants';
import { httpErrors } from 'src/shares/exceptions';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientRole, ClientStatus } from 'src/shares/enums/client.enum';
import { CacheForgotPassword, ForgotPasswordDto } from './dto/forgot-password.dto';
import ChangePasswordByCodeDto from './dto/change-password-by-code.dto';
import ChangePasswordDto from './dto/change-password.dto';
import { generateHash, validateHash } from 'src/shares/helpers/bcrypt';
import { GetClientByPhoneOrderDto, GetClientsDto } from './dto/get-clients.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserFacebookInfoDto } from '../auth/dto/user-facebook-info.dto';
import { UserGoogleInfoDto } from '../auth/dto/user-google-info.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findOne(condition: GetClientDto, selectPassword = false): Promise<Client> {
    if (selectPassword) {
      return this.clientModel.findOne(condition).select('+password');
    }
    return this.clientModel.findOne(condition);
  }

  async findById(_id: string): Promise<Client> {
    return this.clientModel.findById(_id).select('-password');
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { email, password, name, birthday, gender } = signUpDto;
    const user = await this.findOne({ email: email });
    if (user) {
      throw new BadRequestException('The email already exist!');
    }
    const code = randomCodeNumber(6);
    const { hashPassword } = await generateHash(password);
    await this.mailService.sendSignUpEmailJob({ email, code, name, password: hashPassword, birthday, gender });
  }

  async signUpByCode(signUpByCodeDto: SignUpByCodeDto): Promise<void> {
    const { code, email } = signUpByCodeDto;
    const verifyClientCache = await this.cacheManager.get<string>(`${SIGN_UP_CACHE}${email}`);
    if (!verifyClientCache) {
      throw new BadRequestException(httpErrors.CLIENT_EMAIL_VERIFY_FAIL);
    }
    const signUpInfo: SignUpCacheInterface = JSON.parse(verifyClientCache);
    if (signUpInfo.attempt > 4) {
      throw new BadRequestException(httpErrors.CLIENT_CODE_INVALID);
    }
    if (code != signUpInfo.code) {
      await this.cacheManager.set<string>(
        `${SIGN_UP_CACHE}${email}`,
        JSON.stringify({ ...signUpInfo, attempt: signUpInfo.attempt + 1 }),
        {
          ttl: SIGN_UP_EXPIRY,
        },
      );
      throw new BadRequestException(httpErrors.CLIENT_EXPIRED_CODE);
    }
    if (signUpInfo.code !== code) {
      throw new BadRequestException(httpErrors.CLIENT_EMAIL_VERIFY_FAIL);
    }
    const { name, password, gender, birthday } = signUpInfo;
    await this.createClientSignUpByCode({ email, name, password, gender, birthday });
  }

  async createClientSignUpByCode(createClientDto: CreateClientDto): Promise<Client> {
    const { email, password, name, gender } = createClientDto;
    const client = await this.clientModel.findOne({ email });
    if (client) {
      throw new BadRequestException(httpErrors.CLIENT_EXISTED);
    }
    return this.clientModel.create({
      ...createClientDto,
      password,
      status: ClientStatus.ACTIVE,
      is_verify: true,
      name,
      gender,
    });
  }

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const { email, password } = createClientDto;
    const client = await this.clientModel.findOne({ email });
    if (client) {
      throw new BadRequestException(httpErrors.CLIENT_EXISTED);
    }
    const { hashPassword } = await generateHash(password);
    return this.clientModel.create({ ...createClientDto, password: hashPassword, status: ClientStatus.ACTIVE });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const client = await this.clientModel.findOne({ email });
    if (!client) {
      throw new BadRequestException(httpErrors.CLIENT_EMAIL_CONFIRM_NOT_FOUND);
    }

    await this.mailService.sendForgotPasswordEmailJob(email);
  }

  async changePasswordByCode(changePasswordByCode: ChangePasswordByCodeDto): Promise<void> {
    const { verifyCode, password, email } = changePasswordByCode;
    const clientId = await this.checkVerificationCode(verifyCode, email);
    const { hashPassword } = await generateHash(password);
    await this.clientModel.updateOne({ _id: clientId }, { password: hashPassword });
  }

  async checkVerificationCode(verifyCode: string, email: string): Promise<Client> {
    const client = await this.clientModel.findOne({ email });
    if (!client) {
      throw new BadRequestException(httpErrors.CLIENT_EMAIL_CONFIRM_NOT_FOUND);
    }
    const verifyClientCache = await this.cacheManager.get<string>(`${FORGOT_PASSWORD_CACHE}${email}`);
    if (!verifyClientCache) {
      throw new BadRequestException();
    }
    const forgotPasswordInfo: CacheForgotPassword = JSON.parse(verifyClientCache);

    if (forgotPasswordInfo.attempt > 4) {
      throw new BadRequestException(httpErrors.CLIENT_CODE_INVALID);
    }

    if (verifyCode != forgotPasswordInfo.code) {
      await this.cacheManager.set<string>(
        `${FORGOT_PASSWORD_CACHE}${email}`,
        JSON.stringify({ ...forgotPasswordInfo, attempt: forgotPasswordInfo.attempt + 1 }),
        {
          ttl: FORGOT_PASSWORD_EXPIRY,
        },
      );
      throw new BadRequestException(httpErrors.CLIENT_EXPIRED_CODE);
    }

    return client;
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const { email, password, newPassword } = changePasswordDto;
    const user = await this.clientModel.findOne({ email });
    const validatePassword = await validateHash(password, user?.password || '');
    if (!user || !validatePassword) {
      throw new BadRequestException(httpErrors.USER_WRONG_PASSWORD);
    }
    const { hashPassword } = await generateHash(newPassword);
    await this.clientModel.updateOne({ _id: user.id }, { password: hashPassword });
  }

  async findAll(getUsersDto: GetClientsDto): Promise<ResPagingDto<Client[]>> {
    const { sort, page, limit, id, name } = getUsersDto;
    const query: any = {};

    if (id) {
      query._id = id;
    }

    if (name) {
      query.name = name;
    }

    const [result, total] = await Promise.all([
      this.clientModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.clientModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOrCreateFacebookUser(profile: UserFacebookInfoDto): Promise<Client> {
    const client = await this.clientModel.findOne({ facebook_id: profile.id });

    if (client) {
      return this.clientModel.findByIdAndUpdate(
        client._id,
        {
          image_url: profile.picture.data.url,
          lastLoginAt: new Date(),
        },
        { new: true },
      );
    }

    return this.clientModel.create({
      facebook_id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
      image_url: profile.picture.data.url,
      role: ClientRole.khach_hang,
      last_login_at: new Date(),
      status: ClientStatus.ACTIVE,
      is_verify: true,
    });
  }

  async findOrCreateGoogleUser(profile: UserGoogleInfoDto): Promise<Client> {
    const { sub, picture, given_name, family_name, email } = profile.data;
    const client = await this.clientModel.findOne({ google_id: sub });

    if (client) {
      return this.clientModel.findByIdAndUpdate(
        client._id,
        {
          image_url: picture,
          last_login_at: new Date(),
          email,
        },
        { new: true },
      );
    }

    return this.clientModel.create({
      google_id: sub,
      name: `${given_name} ${family_name}`,
      image_url: picture,
      role: ClientRole.khach_hang,
      last_login_at: new Date(),
      email,
      status: ClientStatus.ACTIVE,
      is_verify: true,
    });
  }

  async searchClientInOrder(getClientByPhoneOrderDto: GetClientByPhoneOrderDto): Promise<any> {
    const { phone } = getClientByPhoneOrderDto;
    // const query: any = {};
    const clients = await this.clientModel.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'client_id',
          as: 'orders',
        },
      },
      {
        $lookup: {
          from: 'orders_hikari',
          localField: '_id',
          foreignField: 'client_id',
          as: 'hikariOrders',
        },
      },
      {
        $match: {
          phone,
          'hikariOrders.client_id': { $exists: false },
          'orders.client_id': { $exists: true },
        },
      },
    ]);

    return clients;
  }
}
