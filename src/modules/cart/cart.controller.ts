import { Controller, Get, Post, Query, Body, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { ClientAuth } from 'src/shares/decorators/http.decorators';
import { GetCartDto } from './dto/get-cart.dto';
import { Cart } from './schemas/cart.schema';
import { IdDto } from 'src/shares/dtos/param.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@ApiTags('Cart')
@Controller('cart')
@ClientAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: `Get all user's cart and paging` })
  async find(@UserID() userId: string, @Query() query: GetCartDto): Promise<ResPagingDto<Cart[]>> {
    return this.cartService.find(query, userId);
  }

  @Post()
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: 'Create new cart' })
  async create(@Body() createCartDto: CreateCartDto, @UserID() userId: string): Promise<void> {
    return this.cartService.createCart(createCartDto, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete cart by id' })
  async deleteCart(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.cartService.deleteById(param.id, userId);
  }
}
