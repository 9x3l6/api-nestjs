import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Video } from './../entities/video.entity';
import {
  ArchivedVideoSearchBody,
  ArchivedVideoSearchResult,
} from './archived-videos-search.interface';

@Injectable()
export default class ArchivedVideosSearchService {
  index = 'archived-videos'

  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  async indexVideo(video: Video) {
    return this.elasticsearchService.index<ArchivedVideoSearchResult, ArchivedVideoSearchBody>({
      index: this.index,
      body: {
        ...video
      }
    })
  }

  async search(text: string) {
    const { body } = await this.elasticsearchService.search<ArchivedVideoSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'description', 'path']
          }
        }
      }
    })
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async update(video: Video) {
    const newBody: ArchivedVideoSearchBody = {
      ...video
    }

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: video.id,
          }
        },
        script: {
          inline: script
        }
      }
    })
  }

  async remove(id: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id,
          }
        }
      }
    })
  }
}