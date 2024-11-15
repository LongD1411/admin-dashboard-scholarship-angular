export interface BaseResponse<T> {
    code: number;
    results: T[];
    result: T;
    message: string;
    totalPages: number;
    totalItems: number;
  }
  