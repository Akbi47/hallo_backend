import { Controller, Get, Post, Patch, Param, Body, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoriesDto } from './dto/update.categories.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { CategoriesService } from './categories.service';
import { Categories } from './schemas/categories.schema';
import { UserRole } from 'src/shares/enums/user.enum';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { IdDto } from 'src/shares/dtos/param.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get categories' })
  async getCategory(@Param() getCategoriesDto: GetCategoriesDto): Promise<ResPagingDto<Categories[]>> {
    return await this.categoriesService.findCategory(getCategoriesDto);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create categories' })
  async createCategory(@Body() createCategoriesDto: CreateCategoriesDto): Promise<void> {
    await this.categoriesService.createCategory(createCategoriesDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update categories by id' })
  async updateCategory(@Param() param: IdDto, @Body() updateCategoriesDto: UpdateCategoriesDto): Promise<void> {
    await this.categoriesService.updateCategory(param.id, updateCategoriesDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete categories by id' })
  async deleteCategory(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.categoriesService.deleteCategory(param.id, userId);
  }
}
