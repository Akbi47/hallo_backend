import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClientAuth, UserAuth } from 'src/shares/decorators/http.decorators';
import { FeedbackService } from './feedback.service';
import { IdDto } from 'src/shares/dtos/param.dto';
import { GetFeedbackDto } from './dto/get-feedback.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { Feedback } from './schemas/feedback.schema';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @ApiBearerAuth()
  @UserAuth()
  @Get()
  @ApiOperation({ summary: 'Get feedbacks' })
  async find(@Query() query: GetFeedbackDto): Promise<ResPagingDto<Feedback[]>> {
    return this.feedbackService.find(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Feedback by id' })
  async findOne(@Param() { id }: IdDto): Promise<Feedback> {
    return this.feedbackService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: 'Create Feedback ' })
  async create(@Body() body: CreateFeedbackDto, @UserID() userId: string): Promise<void> {
    await this.feedbackService.create(body, userId);
  }
}
