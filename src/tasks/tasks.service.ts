import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  // @Cron('0 * * * * *')
  @Cron(CronExpression.EVERY_HOUR, {
    name: 'hourly'
  })
  runHourly() {
    this.logger.debug('Every hour')
  }
}
