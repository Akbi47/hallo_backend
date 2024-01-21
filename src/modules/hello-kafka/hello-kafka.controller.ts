import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HelloKafkaService } from 'src/modules/hello-kafka/hello-kafka.service';

@Controller('hello-kafka')
@ApiTags('Hello Kafka')
export class HelloKafkaController {
  constructor(private helloKafkaService: HelloKafkaService) {}

  @Post()
  @ApiBody({
    required: true,
    description: `Data to push to kafka. Example { "data" : "hello" } `,
  })
  async sendToKafka(@Body('data') data: string): Promise<boolean> {
    await this.helloKafkaService.sendDataToKafka({
      data: data,
      otherthing: '123456',
    });
    return true;
  }
}
