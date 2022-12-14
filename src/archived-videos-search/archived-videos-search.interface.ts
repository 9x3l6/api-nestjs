export interface ArchivedVideoSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: ArchivedVideoSearchBody;
    }>;
  };
}
export interface ArchivedVideoSearchBody {
  id: number,
  videoId: string,
  title: string,
  description: string,
  tags: string[],
  url: string,
  duration: number,
  uploaded: string,
  width: number,
  height: number,
  storageUrl: string,
  directory: string,
  path: string,
  provider: string,
  removed: boolean,
}
