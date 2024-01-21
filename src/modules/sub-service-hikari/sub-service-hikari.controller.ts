import { Body, Controller, Param, Patch } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SubServiceHikariService } from './sub-service-hikari.service'
import { UserAuth } from 'src/shares/decorators/http.decorators'
import { UpdateSubService } from './dto/update-sub-service-hikari.dto'
import { IdDto } from 'src/shares/dtos/param.dto'

@ApiTags('Sub Service Hikari')
@Controller('sub-service-hikari')
export class SubServiceHikariController {
  constructor(private subServiceHikariService: SubServiceHikariService) {}

  @Patch('/:id')
  @ApiOperation({ summary: 'User update sub service' })
  @ApiBearerAuth()
  @UserAuth()
  async updateSubService(@Body() updateSubService: UpdateSubService, @Param() param: IdDto): Promise<void> {
    return await this.subServiceHikariService.updateSubService(updateSubService, param)
  }
}
