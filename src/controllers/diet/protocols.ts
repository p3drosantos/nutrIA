export enum Goal {
  LOSE_WEIGHT = "lose_weight",
  GAIN_MUSCLE = "gain_muscle",
}

export enum Allergy {
  PEANUT = "peanut",
  MILK = "milk",
  EGG = "egg",
  GLUTEN = "gluten",
  SOY = "soy",
  NUT = "nut",
  SEAFOOD = "seafood",
  WHEAT = "wheat",
}

export enum PreferenceDiet {
  VEGETARIAN = "vegetarian",
  VEGAN = "vegan",
  LOW_CARB = "low_carb",
  HIGH_PROTEIN = "high_protein",
}

export interface GenerateDietParams {
  goal: Goal;
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  allergies?: Allergy[];
  preferences?: PreferenceDiet[];
}

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

export interface IGenerateDietController {
  generateDiet(params: GenerateDietParams): Promise<DietPlan>;
}

export interface IGenerateDietUseCase {
  generateDiet(params: GenerateDietParams): Promise<DietPlan>;
}
