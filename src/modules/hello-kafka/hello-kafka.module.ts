import { Module } from '@nestjs/common';
import { HelloKafkaConsole } from 'src/modules/hello-kafka/hello-kafka.console';
import { HelloKafkaController } from 'src/modules/hello-kafka/hello-kafka.controller';
import { HelloKafkaService } from 'src/modules/hello-kafka/hello-kafka.service';

@Module({
  imports: [],
  providers: [HelloKafkaService, HelloKafkaConsole],
  exports: [],
  controllers: [HelloKafkaController],
})
export class HelloKafka {}
