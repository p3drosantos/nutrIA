import {
  AiRequestAction,
  IAIRequestLogRepository,
} from "../../controllers/ai-request-log/protocols";

import { prisma } from "../../lib/prisma";

export class CreateAiRequestLogRepository implements IAIRequestLogRepository {
  async countAIRequests(userId: number): Promise<number> {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);

    const count = await prisma.aiRequestLog.count({
      where: {
        userId,
        createdAt: {
          gte: dayStart,
        },
      },
    });
    return count;
  }
  async createAIRequestLog(
    userId: number,
    action: AiRequestAction,
  ): Promise<void> {
    await prisma.aiRequestLog.create({
      data: {
        userId,
        action,
      },
    });
  }
}
