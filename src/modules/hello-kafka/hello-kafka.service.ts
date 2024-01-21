import { Injectable } from '@nestjs/common';
import { KafkaTopics } from 'src/shares/enums/kafka.enum';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';

@Injectable()
export class HelloKafkaService {
  constructor(private kafkaClient: KafkaClient) {}
  async sendDataToKafka(data: any): Promise<void> {
    console.log('send data to kafka: ');
    console.log('topic: ', KafkaTopics.HELLO_TOPIC);
    console.log('data: ', data);
    await this.kafkaClient.send(KafkaTopics.HELLO_TOPIC, data);
  }

  async processDataFromKafka(data: any): Promise<void> {
    console.log('receive data from kafka: ');
    console.log('data: ', data);
  }
}
