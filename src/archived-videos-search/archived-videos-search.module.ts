import { Module } from '@nestjs/common';
import ArchivedVideosSearchService from './archived-videos-search.service';

@Module({
  providers: [ArchivedVideosSearchService]
})
export class ArchivedVideosSearchModule {}
