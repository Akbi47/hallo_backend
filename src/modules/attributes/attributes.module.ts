import { Module } from '@nestjs/common';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Attribute, AttributeSchema } from './schemas/attributes.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Attribute.name, schema: AttributeSchema }])],
  controllers: [AttributesController],
  providers: [AttributesService],
})
export class AttributesModule {}
