import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ServiceHikariService } from './service-hikari.service'
import { UserAuth } from 'src/shares/decorators/http.decorators'
import { GetServiceHikariDto } from './dto/get-service-hikari.dto'
import { IdDto } from 'src/shares/dtos/param.dto'

@ApiTags('Service Hikari')
@Controller('service-hikari')
export class ServiceHikariController {
  constructor(private serviceHikariService: ServiceHikariService) {}

  @Get()
  @ApiOperation({ summary: `Get all service hikari` })
  @ApiBearerAuth()
  @UserAuth()
  async findAll(@Query() query: GetServiceHikariDto): Promise<any> {
    console.log(query)
    return await this.serviceHikariService.findAll(query)
  }

  @Get('/:id')
  @ApiOperation({ summary: `Get a service hikari` })
  @ApiBearerAuth()
  @UserAuth()
  async find(@Param() param: IdDto): Promise<any> {
    return await this.serviceHikariService.find(param)
  }
}
