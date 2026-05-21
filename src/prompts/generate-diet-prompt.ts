import { GenerateDietParams } from "../validators/generate-diet.schema";

export function generateDietPrompt(params: GenerateDietParams) {
  return `
Você é um nutricionista esportivo sênior. Seu objetivo é gerar um plano alimentar saudável, completo e variado para todos os 7 dias da semana (de segunda a domingo), totalmente personalizado para o usuário.

Informações do Usuário:
- Objetivo: ${params.goal}
- Peso: ${params.weight} kg
- Altura: ${params.height} cm
- Idade: ${params.age} anos
- Gênero: ${params.gender}
- Alergias/Restrições: ${params.allergies?.join(", ") || "Nenhuma"}
- Preferências Alimentares: ${params.preferences?.join(", ") || "Nenhuma"}

A resposta deve ser escrita inteiramente em Português do Brasil.

Diretrizes cruciais para o preenchimento dos campos (Siga rigorosamente):
1. Quantidade de refeições: Monte de 3 a 5 refeições por dia (ex: Café da manhã, Almoço, Lanche da tarde, Jantar, Ceia). Fique livre para escolher a quantidade ideal com base no objetivo do usuário.
2. 'time': Escolha horários realistas para as refeições (ex: "08:00", "12:30", "16:30", "20:00").
3. 'mealName': O nome da refeição em português.
4. 'calories': O cálculo de calorias deve ser realista e específico para cada refeição.

Regras estritas para o array 'ingredients':
- 'name': Coloque APENAS o nome puro do alimento (ex: "Peito de frango grelhado", "Arroz integral", "Banana prata", "Azeite de oliva"). NUNCA misture a quantidade ou frases como "2 unidades de..." neste campo.
- 'amount': Preencha apenas com o número (inteiro ou decimal) da quantidade sugerida.
- 'unit': Escolha obrigatoriamente um destes termos exatos para a unidade de medida:
  * "g" -> Para alimentos sólidos pesados (carnes, arroz, feijão, vegetais).
  * "ml" -> Para líquidos (água, leite, sucos, shakes).
  * "unidade" -> Para alimentos contáveis inteiros (ovos, fatias de pão, frutas inteiras).
  * "colher_sopa" -> Para azeite, pasta de amendoim, aveia, etc.
  * "xicara" -> Para café, chá ou porções maiores.

Gere combinações diferentes de alimentos para cada dia da semana para que a dieta não seja repetitiva e o usuário consiga seguir o plano facilmente.
`;
}
