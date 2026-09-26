export type ApiSuccessResponse<T = Record<string, unknown>> = {
  ok: true;
} & T;

export interface ApiErrorResponse {
  ok?: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T = Record<string, unknown>> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;
