export interface BaseEntity {
  id: string;
  createdAt: string;
}

export interface Column<T> {
  label: string;
  accessor: keyof T;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}
