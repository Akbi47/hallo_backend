import { Body, Controller, Delete, Get, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { UserAuthPermission } from 'src/shares/decorators/http.decorators';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { endpoints } from 'src/shares/endpoints';
import { PermissionReq } from './dto/permission.req';
import { PermissionService } from './permission.service';
import { Permission } from './schemas/permission.schema';

@ApiTags('Permission')
@Controller(endpoints.permissions.root)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get(endpoints.permissions.getList.endpoint)
  //   @UserAuth()
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll(@Req() req: Request): Promise<ResPagingDto<Permission[]>> {
    return this.permissionService.getList(req);
  }

  @Post(endpoints.permissions.addNew.endpoint)
  @ApiOperation({ summary: 'Create permission test' })
  @ApiBearerAuth()
  @UserAuthPermission()
  async createUser(@Body() createPermissionReq: PermissionReq, @UserID() userId: string): Promise<void> {
    await this.permissionService.createPermissions(createPermissionReq, userId);
  }

  @Put(endpoints.permissions.update.endpoint)
  @ApiOperation({ summary: 'Update permission test' })
  @ApiBearerAuth()
  @UserAuthPermission()
  async updatePermission(
    @Body() updatePermReq: PermissionReq,
    @Query('_id') _id: string,
    @UserID() userId: string,
  ): Promise<void> {
    await this.permissionService.updatePermission(updatePermReq, _id, userId);
  }

  @Delete(endpoints.permissions.delete.endpoint)
  @ApiOperation({ summary: 'Delete permission test' })
  @ApiBearerAuth()
  @UserAuthPermission()
  async deletePermission(@Query('ids') ids: string, @UserID() userId: string): Promise<void> {
    await this.permissionService.deletePermission(ids, userId);
  }
}
