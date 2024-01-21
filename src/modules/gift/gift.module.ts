import { Module } from '@nestjs/common';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Gift, GiftSchema } from './schemas/gift.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Gift.name, schema: GiftSchema }])],
  controllers: [GiftController],
  providers: [GiftService],
})
export class GiftModule {}
