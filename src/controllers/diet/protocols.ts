import { DietPlanEntity } from "../../models/DietPlan.model";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import { GenerateDietParams } from "../../validators/generate-diet.schema";
import { GenerateDietUseCaseInput } from "../../use-cases/diet/GenerateDietUseCase";
import { User } from "../../models/User.model";
import { UpdateDietParams } from "../../validators/update-diet-schema";
import { dietPlanSchema } from "../../validators/diet-plan.schema";
import z from "zod";

export type DietPlan = z.infer<typeof dietPlanSchema>;

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

export interface IDeleteDietPlanController {
  deleteDietPlan(
    httpRequest: HttpRequest<unknown, { id: number }>,
  ): Promise<HttpResponse<string | ValidationError[]>>;
}

export interface IDeleteDietPlanUseCase {
  deleteDietPlan(id: number, userId: number): Promise<void>;
}

export interface IDeleteDietPlanRepository {
  deleteDietPlan(id: number): Promise<void>;
}
export interface UpdateDietPlanUseCaseInput {
  dietId: number;
  userId: number;
  userRequest: string;
}

export interface UpdateDietUseCaseResponse {
  success: boolean;
  message: string;
  dietPlan: DietPlan;
}

export interface IUpdateDietPlanRepository {
  updateDiet(id: number, newDietPlan: DietPlan): Promise<void>;
}

export interface IUpdateDietPlanUseCase {
  updateDiet(
    params: UpdateDietPlanUseCaseInput,
  ): Promise<UpdateDietUseCaseResponse>;
}

export interface IUpdateDietPlanController {
  updateDiet(
    httpRequest: HttpRequest<UpdateDietParams>,
  ): Promise<
    HttpResponse<UpdateDietUseCaseResponse | ValidationError[] | string>
  >;
}
