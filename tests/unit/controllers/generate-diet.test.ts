import { GenerateDietController } from "../../../src/controllers/diet/GenerateDietController";
import { HttpRequest } from "../../../src/controllers/protocols";
import { GenerateDietParams } from "../../../src/validators/generate-diet.schema";

const makeSut = () => {
  const mockUseCase = {
    generateDiet: jest.fn(),
  };

  const sut = new GenerateDietController(mockUseCase);

  return {
    sut,
    mockUseCase,
  };
};

const makeRequest = (
  overrides?: Partial<GenerateDietParams>,
): HttpRequest<GenerateDietParams> => ({
  body: {
    goal: "lose_weight",
    weight: 70,
    height: 175,
    age: 30,
    gender: "male",
    allergies: ["peanut", "egg"],
    preferences: ["vegetarian"],
    ...overrides,
  },
});

describe("GenerateDietController", () => {
  it("should return 200 and generated diet", async () => {
    const { sut, mockUseCase } = makeSut();
    const request = makeRequest();
    const mockDiet = { id: "1", dietPlan: { breakfast: "Breakfast" } };
    mockUseCase.generateDiet.mockResolvedValue(mockDiet);
    const response = await sut.generateDiet(request);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockDiet);
    expect(mockUseCase.generateDiet).toHaveBeenCalledWith(request.body);
  });

  it("should return 400 if body is missing", async () => {
    const { sut } = makeSut();
    const response = await sut.generateDiet({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("Missing request body.");
  });

  it("should return 400 if validation fails", async () => {
    const { sut } = makeSut();
    const request = makeRequest({ weight: -10 }); // Invalid weight
    const response = await sut.generateDiet(request);
    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body)).toBe(true);
    expect((response.body as any[])[0]).toHaveProperty("field", "weight");
    if (Array.isArray(response.body)) {
      expect(response.body[0].message).toBe("Peso deve ser maior que 30kg");
    }
  });

  it("should return 500 if use case throws an error", async () => {
    const { sut, mockUseCase } = makeSut();
    const request = makeRequest();
    mockUseCase.generateDiet.mockRejectedValue(new Error("Use case error"));
    const response = await sut.generateDiet(request);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(
      "An error occurred while generating the diet plan.",
    );
  });
});
