import { DietPlanEntity } from "../../models/DietPlan.model";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import { GenerateDietParams } from "../../validators/generate-diet.schema";
import { GenerateDietUseCaseInput } from "../../use-cases/diet/GenerateDietUseCase";
import { User } from "../../models/User.model";

export interface DietPlan {
  breakfast: {
    foods: string[];
    calories: number;
  };
  lunch: {
    foods: string[];
    calories: number;
  };
  dinner: {
    foods: string[];
    calories: number;
  };

  totalCalories: number;
}

export interface IGenerateDietResponse {
  id: number;
  dietPlan: DietPlan;
}

export interface IGenerateDietRepositoryParams {
  goal: string;
  dietPlan: DietPlan;
  userId: number;
}

export interface IGenerateDietController {
  generateDiet(
    httpRequest: HttpRequest<GenerateDietParams>,
  ): Promise<HttpResponse<IGenerateDietResponse | ValidationError[] | string>>;
}

export interface IGenerateDietUseCase {
  generateDiet(
    params: GenerateDietUseCaseInput,
  ): Promise<IGenerateDietResponse>;
}

export interface IGenerateDietRepository {
  saveDietPlan(params: IGenerateDietRepositoryParams): Promise<DietPlanEntity>;
}

export interface IGetDietPlanController {
  getDietPlan(
    httpRequest: HttpRequest<unknown, { id: number }>,
  ): Promise<HttpResponse<DietPlanEntity | ValidationError[] | string>>;
}

export interface IGetDietPlanUseCase {
  getDietPlan(id: number, userId: number): Promise<DietPlanEntity | null>;
}

export interface IGetDietPlanRepository {
  findDietPlanById(id: number): Promise<DietPlanEntity | null>;
}

export interface IGetAllDietsPlansController {
  getAllDietPlans(
    httpRequest: HttpRequest<unknown, unknown>,
  ): Promise<HttpResponse<DietPlanEntity[] | ValidationError[] | string>>;
}

export interface IGetAllDietsPlansUseCase {
  getAllDietPlans(userId: number): Promise<DietPlanEntity[]>;
}

export interface IGetAllDietsPlansRepository {
  getAllDietPlans(userId: number): Promise<DietPlanEntity[]>;
}

// export interface IGetUserByIdRepository {
//   getUserById(id: number): Promise<User | null>;
// }
