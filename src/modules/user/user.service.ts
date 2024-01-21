import { BadRequestException, Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserStatus } from 'src/shares/enums/user.enum';
import { GetUsersDto } from './dto/get-users.dto';
import { GetUserDto } from './dto/get-user.dto';
import { httpErrors } from 'src/shares/exceptions';
import { generateHash } from 'src/shares/helpers/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, password } = createUserDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException(httpErrors.ACCOUNT_EXISTED);
    }
    const { hashPassword } = await generateHash(password);

    return this.userModel.create({ ...createUserDto, password: hashPassword, status: UserStatus.ACTIVE });
  }

  async findAll(getUsersDto: GetUsersDto): Promise<ResPagingDto<User[]>> {
    const { sort, page, limit, id, name } = getUsersDto;
    const query: any = {};

    if (id) {
      query._id = id;
    }

    if (name) {
      query.name = name;
    }

    const [result, total] = await Promise.all([
      this.userModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.userModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(condition: GetUserDto, selectPassword = false): Promise<UserDocument> {
    if (selectPassword) {
      return this.userModel.findOne(condition).select('+password').lean();
    }
    return this.userModel.findOne(condition).select('-password').lean();
  }

  async findById(_id: string): Promise<UserDocument> {
    return this.userModel.findById({ _id }).select('-password').lean();
  }
}
