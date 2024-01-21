import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpByCodeDto } from './dto/sign-up-by-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import ChangePasswordByCodeDto from './dto/change-password-by-code.dto';
import ChangePasswordDto from './dto/change-password.dto';
import { GetClientByPhoneOrderDto, GetClientsDto } from './dto/get-clients.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Client } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('search-client')
  // @ApiBearerAuth()
  // @UserAuth()
  @ApiOperation({ summary: `Search client in orders` })
  async searchClientInOrder(@Query() query: GetClientByPhoneOrderDto): Promise<any> {
    return this.clientService.searchClientInOrder(query);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Client Sign up with gmail' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    await this.clientService.signUp(signUpDto);
  }

  @Post('sign-up-by-code')
  @ApiOperation({ summary: 'Client Verification by code' })
  async signUpByCode(@Body() signUpByCodeDto: SignUpByCodeDto): Promise<void> {
    return this.clientService.signUpByCode(signUpByCodeDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Client get code change password by send email' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.clientService.forgotPassword(forgotPasswordDto);
  }

  @Post('change-password-by-code')
  @ApiOperation({ summary: 'Client change password by code' })
  changePasswordByCode(@Body() changePasswordByCodeDto: ChangePasswordByCodeDto): Promise<void> {
    return this.clientService.changePasswordByCode(changePasswordByCodeDto);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change client password' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<void> {
    return this.clientService.changePassword(changePasswordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all client' })
  async findAll(@Query() query: GetClientsDto): Promise<ResPagingDto<Client[]>> {
    return this.clientService.findAll(query);
  }

  // todo: create client testing
  @Post()
  @ApiOperation({ summary: 'Create client test' })
  async createUser(@Body() createUserDto: CreateClientDto): Promise<void> {
    await this.clientService.createClient(createUserDto);
  }
}
