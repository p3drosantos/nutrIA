import { GenerateDietParams } from "../controllers/diet/protocols";

export function generateDietPrompt(params: GenerateDietParams) {
  return `
Generate a healthy daily diet plan.

User information:
- Goal: ${params.goal}
- Weight: ${params.weight} kg
- Height: ${params.height} cm
- Age: ${params.age}
- Gender: ${params.gender}
- Allergies: ${params.allergies?.join(", ") || "None"}
- Preferences: ${params.preferences?.join(", ") || "None"}

Return ONLY valid JSON.

The response must be written entirely in Brazilian Portuguese.

Do not include markdown.
Do not include explanations.
Do not include additional text.

The JSON must follow exactly this structure:

{
  "breakfast": {
    "foods": ["food 1", "food 2"],
    "calories": number
  },
  "lunch": {
    "foods": ["food 1", "food 2"],
    "calories": number
  },
  "dinner": {
    "foods": ["food 1", "food 2"],
    "calories": number
  },
  "totalCalories": number
}
`;
}
