import { User } from "../../models/User.model";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import { IGetUserByIdController, IGetUserByIdUseCase } from "./protocols";

export class GetUserByIdController implements IGetUserByIdController {
  constructor(private getUserByIdUseCase: IGetUserByIdUseCase) {}

  async getUserById(
    httpRequest: HttpRequest,
  ): Promise<
    HttpResponse<Omit<User, "password"> | ValidationError[] | string>
  > {
    try {
      const userId = httpRequest.userId;
      console.log("User ID from request:", userId);
      if (!userId) {
        return {
          statusCode: 401,
          body: "Unauthorized",
        };
      }
      const user = await this.getUserByIdUseCase.getUserById(userId);
      return {
        statusCode: 200,
        body: user ? user : "User not found",
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}
