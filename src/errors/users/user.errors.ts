export class UserAlreadyExistsError extends Error {
  constructor() {
    super("User already exists");
    this.name = "USER_ALREADY_EXISTS_ERROR";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Forbidden");
    this.name = "FORBIDDEN_ERROR";
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "USER_NOT_FOUND_ERROR";
  }
}
