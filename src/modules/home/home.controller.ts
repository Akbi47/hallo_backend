import { Controller, Get, Post, Patch, Body } from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { Home } from './schemas/home.schema';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @Get()
  @ApiOperation({ summary: 'Home' })
  async finds(): Promise<Home> {
    return this.homeService.find();
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] Create home' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async create(@Body() payload: CreateHomeDto): Promise<void> {
    await this.homeService.createHome(payload);
  }

  @Patch()
  @ApiOperation({ summary: '[ ADMIN ] Update home' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async update(@Body() payload: UpdateHomeDto): Promise<void> {
    await this.homeService.updateHome(payload);
  }
}
