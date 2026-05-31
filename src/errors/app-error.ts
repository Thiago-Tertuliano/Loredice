export interface AppError {
  code: string;
  message: string;
  metadata?: Record<string, unknown>;
}
