export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}
export declare function paginate<T>(data: T[], total: number, page: number, limit: number): PaginatedResult<T>;
export declare function getPaginationParams(page?: number, limit?: number): {
    skip: number;
    take: number;
};
