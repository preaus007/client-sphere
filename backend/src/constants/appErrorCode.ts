const enum AppErrorCode {
  // Auth Errors
  InvalidAccessToken = "InvalidAccessToken",
  InvalidRefreshToken = "InvalidRefreshToken",
  ExpiredAccessToken = "ExpiredAccessToken",
  ExpiredRefreshToken = "ExpiredRefreshToken",
  UnauthorizedAccess = "UnauthorizedAccess",
  ForbiddenResource = "ForbiddenResource",

  // User Errors
  UserAlreadyExists = "UserAlreadyExists",
  UserNotFound = "UserNotFound",
  InvalidCredentials = "InvalidCredentials",
  EmailNotVerified = "EmailNotVerified",
  AccountSuspended = "AccountSuspended",

  // Validation Errors
  ValidationFailed = "ValidationFailed",
  MissingRequiredFields = "MissingRequiredFields",
  InvalidEmailFormat = "InvalidEmailFormat",
  PasswordTooWeak = "PasswordTooWeak",

  // Server Errors
  DatabaseError = "DatabaseError",
  InternalServerError = "InternalServerError",
  ServiceUnavailable = "ServiceUnavailable",

  // Other
  ResourceNotFound = "ResourceNotFound",
  TooManyRequests = "TooManyRequests",
}

export default AppErrorCode;
