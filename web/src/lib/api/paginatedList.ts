export default interface PaginatedList<T> {
  items: T[];
  hasNext: boolean;
  totalCount: number;
}
