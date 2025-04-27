import AppErrorCode from "../constants/appErrorCode";
import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  HttpStatusCode,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../constants/http";

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}

// --- Specific Errors ---

export class ConflictError extends AppError {
  constructor(
    message = "Conflict",
    errorCode?: AppErrorCode.UserAlreadyExists
  ) {
    super(CONFLICT, message, errorCode);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", errorCode?: AppErrorCode.UserNotFound) {
    super(NOT_FOUND, message, errorCode);
  }
}

export class InvalidCredentials extends AppError {
  constructor(
    message = "Invalid Credential",
    errorCode?: AppErrorCode.InvalidCredentials
  ) {
    super(NOT_FOUND, message, errorCode);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message = "Unauthorized",
    errorCode?: AppErrorCode.UnauthorizedAccess
  ) {
    super(UNAUTHORIZED, message, errorCode);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", errorCode?: AppErrorCode) {
    super(BAD_REQUEST, message, errorCode);
  }
}

// export class InternalServerError extends AppError {
//   constructor(
//     message = "Internal Server Error",
//     errorCode?: AppErrorCode.InternalServerError
//   ) {
//     super(INTERNAL_SERVER_ERROR, message, errorCode);
//   }
// }
