import { Module } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from './schema/contracts.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Contract.name, schema: ContractSchema }])],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
