import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TypeUseService } from './type-use.service';

@ApiTags('Type Use')
@Controller('type-use')
export class TypeUseController {
  constructor(private typeService: TypeUseService) {}
}
