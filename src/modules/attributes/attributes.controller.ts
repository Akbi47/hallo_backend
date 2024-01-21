import { Controller, Get, Post, Patch, Delete, Query, Body, Param } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { Attribute } from './schemas/attributes.schema';
import { GetAttributeDto } from './dto/get-attribute.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { IdDto } from 'src/shares/dtos/param.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@ApiTags('Attributes')
@Controller('attributes')
export class AttributesController {
  constructor(private attributesService: AttributesService) {}

  @Get()
  @ApiOperation({ summary: 'Get attributes' })
  async getAttribute(@Query() query: GetAttributeDto): Promise<ResPagingDto<Attribute[]>> {
    return this.attributesService.find(query);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create attribute' })
  async createAttribute(@Body() createAttributeDto: CreateAttributeDto): Promise<void> {
    await this.attributesService.createAttribute(createAttributeDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update attribute' })
  async updateAttribute(@Param() param: IdDto, @Body() updateAttributeDto: UpdateAttributeDto): Promise<void> {
    await this.attributesService.updateAttribute(param.id, updateAttributeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete attribute' })
  async deleteAttribute(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.attributesService.deleteAttribute(param.id, userId);
  }
}
