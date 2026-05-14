import {
  IGetAllDietsPlansController,
  IGetAllDietsPlansUseCase,
} from "./protocols";

export class GetAllDietsController implements IGetAllDietsPlansController {
  constructor(private getAllDietsUseCase: IGetAllDietsPlansUseCase) {}
  async getAllDietPlans(httpRequest: any): Promise<any> {
    const { userId } = httpRequest.userId;
    return await this.getAllDietsUseCase.getAllDietPlans(userId);
  }
}
