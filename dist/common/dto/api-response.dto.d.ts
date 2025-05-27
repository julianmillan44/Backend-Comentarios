export declare class ApiResponseDto<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}
export declare class PaginationDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare class PaginatedResponseDto<T> {
    success: boolean;
    data: T[];
    pagination: PaginationDto;
    message?: string;
}
