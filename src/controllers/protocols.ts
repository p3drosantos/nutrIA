export interface HttpRequest<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
  THeaders = unknown,
> {
  body?: TBody;
  params?: TParams;
  query?: TQuery;
  headers?: THeaders;
  userId?: number;
}

export interface HttpResponse<T> {
  statusCode: number;
  body: T | string | ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}
