export interface GlobalErrorResponse {
  success: false;
  status: number;
  message: string;
}

export interface SuccessResponse {
  success: boolean;
  status: number;
  message: string;
  data?: any;
  meta?: Meta;
}

export interface Meta {
  page: number;
  limit: number;
  totalResult: number;
  total: number;
}
