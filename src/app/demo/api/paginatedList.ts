export interface PaginatedListItems<T> {
    items: T[];
    first?: number;
    pageIndex : number;
    totalRecords: number;
    totalPages?:number
    pageSize : number;
    sum?: number;
    sortBy?: string;
    sortDescending?: boolean;
    hasPreviousPage : boolean;
    hasNextPage : boolean;
}