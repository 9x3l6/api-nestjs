import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('archived-channels')
export class ArchivedChannelsProcessor {
  private readonly logger = new Logger(ArchivedChannelsProcessor.name);

  @Process('import-channel')
  importChannel(job: Job) {
    console.log(job.data);
  }
}
