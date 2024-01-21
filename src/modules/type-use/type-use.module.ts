import { Module } from '@nestjs/common';
import { TypeUseController } from './type-use.controller';
import { TypeUseService } from './type-use.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeUse, TypeUseSchema } from './schemas/type-use.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TypeUse.name, schema: TypeUseSchema }])],
  controllers: [TypeUseController],
  providers: [TypeUseService],
})
export class TypeUseModule {}
