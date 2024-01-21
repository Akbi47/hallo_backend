import { Controller, Get, Query, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { ContractService } from './contract.service';
import { GetContractDto } from './dto/get-contract.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Contract } from './schema/contracts.schema';
import { UpdateContractDto } from './dto/update-contract.dto';
import { IdDto } from 'src/shares/dtos/param.dto';

@ApiTags('Contract')
@Controller('contract')
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Get()
  @ApiOperation({ summary: `Get all contract and paging` })
  async find(@Query() query: GetContractDto): Promise<ResPagingDto<Contract[]>> {
    return this.contractService.find(query);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({ summary: '[ ADMIN ] Create new contract' })
  async create(@Body() createUnitDto: CreateContractDto): Promise<Contract> {
    return this.contractService.createContract(createUnitDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] Update contract by id' })
  async update(@Param() param: IdDto, @Body() body: UpdateContractDto): Promise<void> {
    await this.contractService.updateContract(param.id, body);
  }
}
