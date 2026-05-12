export interface HttpRequest<T = any> {
  body?: T;
}

export interface HttpResponse<T> {
  statusCode: number;
  body: T | string | ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}
