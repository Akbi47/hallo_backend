import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { SeederService } from './seeder.service';

@Console()
@Injectable()
export class AdminSeeder {
  constructor(private seederService: SeederService) {}
  @Command({
    command: 'seeder',
    description: 'seeder ',
  })
  async start(): Promise<void> {
    try {
      await this.seederService.createSeeder();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}
