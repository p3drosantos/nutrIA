export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "INVALID_CREDENTIALS_ERROR";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UNAUTHORIZED_ERROR";
  }
}
