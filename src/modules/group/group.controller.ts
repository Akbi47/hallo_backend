import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UserRole } from 'src/shares/enums/user.enum';
import { CreateGroupDto } from './dto/create-group.dto';
import { GetGroupDto } from './dto/get-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';
import { Group } from './schemas/group.schema';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) { }

  @Get()
  @ApiOperation({ summary: 'Get all group' })
  async findGroup(@Query() query: GetGroupDto): Promise<ResPagingDto<Group[]>> {
    return this.groupService.findGroup(query);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create group ' })
  async createGroup(@Body() body: CreateGroupDto): Promise<void> {
    await this.groupService.createServiceGroup(body);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update group by id' })
  async updateGroup(@Param() param: IdDto, @Body() body: UpdateGroupDto): Promise<void> {
    await this.groupService.updateServiceGroup(param.id, body);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete group by id' })
  async deleteGroup(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.groupService.deleteServiceGroup(param.id, userId);
  }
}
