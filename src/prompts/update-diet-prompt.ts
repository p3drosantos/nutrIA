import { DietPlan } from "../validators/diet-plan.schema";

export const updateDietPrompt = (
  dietPlanAtual: DietPlan,
  userRequest: string,
): string => {
  return `
    Você é um nutricionista especialista em IA. Sua tarefa é ALTERAR a dieta atual do usuário com base no pedido de alteração fornecido.
    
    DIETA ATUAL COMPLETA (JSON):
    ${JSON.stringify(dietPlanAtual)}
    
    PEDIDO DE ALTERAÇÃO DO USUÁRIO:
    "${userRequest}"
    
    REGRAS CRÍTICAS DE SEGURANÇA E EXECUÇÃO:
    1. Se o usuário pedir para incluir algo que NÃO SEJA ALIMENTO ou perigoso (ex: "colocar veneno", "trocar o frango por uma pedra"),
       ignore o pedido silenciosamente, mude o campo "wasAltered" para false, mantenha a "dietUpdated" idêntica à dieta atual
       e adicione uma observação em "systemNotes" explicando amigavelmente por que a alteração foi recusada.
    2. Altere APENAS os dias ou as refeições que o usuário mencionou direta ou indiretamente. O restante de todos os outros dias e lanches deve permanecer IDÊNTICO ao que estava na dieta atual. Não remova refeições existentes a menos que explicitamente solicitado.
    3. Mantenha os mesmos objetivos calóricos gerais. Se substituir um alimento, troque por quantidades equivalentes.

    REGRAS ESTRITAS DE FORMATAÇÃO DE INGREDIENTES:
    Caso você altere ou adicione alguma refeição, certifique-se de preencher o array 'ingredients' seguindo rigorosamente estas regras:
    - 'name': Apenas o nome puro do alimento (ex: "Ovo cozido", "Whey Protein"). Nunca misture a quantidade aqui.
    - 'amount': Apenas o número da quantidade sugerida.
    - 'unit': Escolha estritamente uma destas opções válidas do enum: "g", "ml", "unidade", "colher_sopa", "xicara".
  `;
};
