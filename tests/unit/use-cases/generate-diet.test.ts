import { GenerateDietUseCase } from "../../../src/use-cases/diet/GenerateDietUseCase";
import { GenerateDietParams } from "../../../src/validators/generate-diet.schema";

const makeSut = () => {
  const mockRepository = {
    saveDietPlan: jest.fn(),
  };

  const mockAIProvider = {
    generate: jest.fn(),
  };

  const sut = new GenerateDietUseCase(mockAIProvider, mockRepository);

  return {
    sut,
    mockRepository,
    mockAIProvider,
  };
};

const makeRequest = (
  overrides?: Partial<GenerateDietParams>,
): GenerateDietParams => ({
  goal: "lose_weight",
  weight: 70,
  height: 175,
  age: 30,
  gender: "male",
  allergies: ["peanut", "egg"],
  preferences: ["vegetarian"],
  ...overrides,
});

describe("GenerateDietUseCase", () => {
  it("should generate a diet plan and save it", async () => {
    const { sut, mockRepository, mockAIProvider } = makeSut();

    const params = makeRequest();

    const aiResponse = {
      dietPlan: "A healthy diet plan",
    };
    mockAIProvider.generate.mockResolvedValue(aiResponse);

    const savedDietPlan = {
      id: "1",
      dietPlan: aiResponse,
    };
    mockRepository.saveDietPlan.mockResolvedValue(savedDietPlan);

    const response = await sut.generateDiet(params);

    expect(mockAIProvider.generate).toHaveBeenCalled();
    expect(mockRepository.saveDietPlan).toHaveBeenCalledWith({
      goal: params.goal,
      dietPlan: aiResponse,
    });
    expect(response).toEqual(savedDietPlan);
  });
});
