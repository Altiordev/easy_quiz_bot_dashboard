export interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface IGetAllPagination<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
