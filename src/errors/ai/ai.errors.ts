export class AiRequestLimitExceededError extends Error {
  constructor() {
    super(
      "You have exceeded the daily diet generation limit. Please try again later.",
    );
    this.name = "AiRequestLimitExceededError ";
  }
}
