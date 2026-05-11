import {
  DietPlan,
  GenerateDietParams,
  IGenerateDietController,
  IGenerateDietUseCase,
} from "./protocols";

export class GenerateDietController implements IGenerateDietController {
  constructor(private readonly generateDietUseCase: IGenerateDietUseCase) {}
  async generateDiet(params: GenerateDietParams): Promise<DietPlan> {
    const response = await this.generateDietUseCase.generateDiet(params);
    return response;
  }
}
