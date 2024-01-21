import { Categories, CategoriesDocument } from './schemas/categories.schema';
import { UpdateCategoriesDto } from './dto/update.categories.dto';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { httpErrors } from 'src/shares/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Categories.name) private categoriesModel: Model<CategoriesDocument>) {}

  async findCategory(getCategoriesDto: GetCategoriesDto): Promise<ResPagingDto<Categories[]>> {
    const { sort, page, limit, id } = getCategoriesDto;
    const query: any = {};
    query.deleted = false;

    if (id) {
      query._id = id;
    }

    const [result, total] = await Promise.all([
      this.categoriesModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.categoriesModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async createCategory(createCategoriesDto: CreateCategoriesDto): Promise<void> {
    const { name } = createCategoriesDto;
    const category = await this.categoriesModel.findOne({ name });
    if (category) {
      throw new BadRequestException(httpErrors.CATEGORY_EXISTED);
    }
    await this.categoriesModel.create(createCategoriesDto);
  }

  async updateCategory(categoryId: string, updateCategoriesDto: UpdateCategoriesDto): Promise<void> {
    const category = await this.categoriesModel.findById(categoryId);
    if (!category) {
      throw new BadRequestException(httpErrors.CATEGORY_NOT_FOUND);
    }
    await this.categoriesModel.updateOne({ _id: categoryId }, updateCategoriesDto);
  }

  async deleteCategory(id: string, delete_by: string): Promise<void> {
    const category = await this.categoriesModel.findById(id);
    if (!category) {
      throw new BadRequestException(httpErrors.CATEGORY_NOT_FOUND);
    }
    await this.categoriesModel.findOneAndUpdate({ _id: id }, { deleted: true, delete_by });
  }
}
