import {
  DietPlan,
  GenerateDietParams,
  IGenerateDietController,
  IGenerateDietResponse,
  IGenerateDietUseCase,
} from "./protocols";

export class GenerateDietController implements IGenerateDietController {
  constructor(private readonly generateDietUseCase: IGenerateDietUseCase) {}
  async generateDiet(
    params: GenerateDietParams,
  ): Promise<IGenerateDietResponse> {
    const response = await this.generateDietUseCase.generateDiet(params);
    return response;
  }
}
