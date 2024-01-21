import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { HelloKafkaService } from 'src/modules/hello-kafka/hello-kafka.service';
import { KafkaGroups, KafkaTopics } from 'src/shares/enums/kafka.enum';
import { sleep } from 'src/shares/helpers/utils';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';

@Console()
@Injectable()
export class HelloKafkaConsole {
  constructor(private helloKafkaService: HelloKafkaService, private kafkaClient: KafkaClient) {}
  @Command({
    command: 'start hello-kafka',
    description: 'Hello kafka module',
  })
  async startConsoleProcess(): Promise<void> {
    console.log('Start consume data from kafka');
    console.log('topic: ', KafkaTopics.HELLO_TOPIC);
    console.log('group: ', KafkaGroups.HELLO_GROUP);
    await this.kafkaClient.consume(KafkaTopics.HELLO_TOPIC, KafkaGroups.HELLO_GROUP, async (data) => {
      await this.helloKafkaService.processDataFromKafka(data);
    });
    while (true) {
      await sleep(5000);
    }
  }
}
