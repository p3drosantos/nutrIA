export class AiGenerationRequestLimitExceededError extends Error {
  constructor() {
    super(
      "You have exceeded the daily diet generation limit. Please try again later.",
    );
    this.name = "AI_GENERATION_REQUEST_LIMIT_EXCEEDED_ERROR";
  }
}

export class AiUpdateRequestLimitExceededError extends Error {
  constructor() {
    super(
      "You have exceeded the daily diet update limit. Please try again later.",
    );
    this.name = "AI_UPDATE_REQUEST_LIMIT_EXCEEDED_ERROR";
  }
}

export class AIUnavailableError extends Error {
  constructor() {
    super("AI temporarily unavailable");
    this.name = "AI_UNAVAILABLE_ERROR";
  }
}
