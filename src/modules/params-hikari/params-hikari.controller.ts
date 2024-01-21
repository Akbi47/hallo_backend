import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParamsHikariService } from './params-hikari.service';
@ApiTags('Params Hikari')
@Controller('params-hikari')
export class ParamsHikariController {
  constructor(private typeService: ParamsHikariService) {}
}
