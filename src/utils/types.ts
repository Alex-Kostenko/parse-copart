export interface IPositiveRequest {
  success: boolean;
}

export interface IPayloadBody {
  backUrl: string;
  defaultSort: boolean;
  displayName: string;
  filter: {};
  freeFormSearch: boolean;
  hideImages: boolean;
  includeTagByField: {};
  page: number;
  query: string[];
  rawParams: {};
  searchName: string;
  size: number;
  sort: string[];
  specificRowProvided: boolean;
  start: number;
  watchListOnly: boolean;
}
