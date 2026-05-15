export class DietNotFoundError extends Error {
  constructor() {
    super("Diet plan not found");
    this.name = "DietNotFoundError";
  }
}
