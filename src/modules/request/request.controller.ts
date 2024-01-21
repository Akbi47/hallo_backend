import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientAuth, UserAuth } from 'src/shares/decorators/http.decorators';
import { RequestService } from './request.service';
import { GetRequestDto } from './dto/get-request.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { Requests } from './schemas/request.schema';

@ApiTags('Request')
@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @ApiBearerAuth()
  @UserAuth()
  @Get()
  @ApiOperation({ summary: 'Get request' })
  async find(@Query() query: GetRequestDto): Promise<ResPagingDto<Requests[]>> {
    return this.requestService.find(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by id' })
  async findOne(@Param() { id }: IdDto): Promise<Requests> {
    return this.requestService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: 'Create request ' })
  async create(@Body() body: CreateRequestDto, @UserID() userId: string): Promise<void> {
    await this.requestService.create(body, userId);
  }
}
