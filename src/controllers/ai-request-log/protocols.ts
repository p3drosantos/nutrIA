export type AiRequestAction = "GENERATE" | "UPDATE";

export interface IAIRequestLogRepository {
  countAIRequests(userId: number): Promise<number>;
  createAIRequestLog(userId: number, action: AiRequestAction): Promise<void>;
}
