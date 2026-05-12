export interface HttpRequest<T = any> {
  body?: T;
}

export interface HttpResponse<T> {
  statusCode: number;
  body: T | string;
}
