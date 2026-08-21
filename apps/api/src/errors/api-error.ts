import { getRequestId } from "../context/request-context.js";

export type ApiErrorCode =
  | "INVALID_REQUEST"
  | "RESOURCE_NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ApiErrorCode;

  constructor(statusCode: number, code: ApiErrorCode, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof SyntaxError) {
    return new ApiError(
      400,
      "INVALID_REQUEST",
      "Invalid JSON request body"
    );
  }

  return new ApiError(
    500,
    "INTERNAL_ERROR",
    "Internal Server Error"
  )
}

export function toApiErrorResponse(error: unknown) {
  const apiError = toApiError(error);

  return {
    error: {
      code: apiError.code,
      message: apiError.message,
      requestId: getRequestId() ?? "unknown"
    }
  }
}
