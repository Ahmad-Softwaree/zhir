export type DataTypes = any;

export type PaginationObject<T extends DataTypes> = {
  data: T[];
  next: boolean;
  total: number;
  total_page: number;
  page: number;
  limit: number;
};
