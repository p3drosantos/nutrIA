import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NutrIA API",
      version: "1.0.0",
      description: "API de geração inteligente de dietas com IA",
    },

    servers: [
      {
        url: "https://nutria-sgcd.onrender.com",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "ID do usuário",
              example: 123,
            },
            name: {
              type: "string",
              description: "Nome do usuário",
              example: "João Silva",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
              example: "Jhon@example.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação do usuário",
              example: "2024-01-01T12:00:00Z",
            },
          },
        },
        RegisterUserRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              description: "Nome do usuário",
              example: "João Silva",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
              example: "Jhon@example.com",
            },
            password: {
              type: "string",
              description: "Senha do usuário",
              example: "password123",
            },
          },
        },
        Ingredient: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Nome do ingrediente",
              example: "Arroz",
            },
            amount: {
              type: "number",
              description: "Quantidade do ingrediente",
              example: 200,
            },
            unit: {
              type: "string",
              description: "Unidade de medida do ingrediente",
              example: "g",
            },
          },
        },
        Meal: {
          type: "object",
          properties: {
            time: {
              type: "string",
              description: "Hora da refeição",
              example: "12:00",
            },
            mealName: {
              type: "string",
              description: "Nome da refeição",
              example: "Almoço",
            },
            ingredients: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Ingredient",
              },
              calories: {
                type: "number",
                description: "Calorias totais da refeição",
                example: 500,
              },
            },
          },
        },
        DietPlan: {
          type: "object",

          properties: {
            segunda: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Meal",
              },
            },

            terca: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Meal",
              },
            },

            quarta: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Meal",
              },
            },

            quinta: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Meal",
              },
            },

            sexta: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Meal",
              },
            },

            sabado: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Meal",
              },
            },

            domingo: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Meal",
              },
            },
          },
        },
        DietPlanEntity: {
          type: "object",

          properties: {
            id: {
              type: "number",
              example: 1,
            },
            goal: {
              type: "string",
              enum: ["lose_weight", "gain_muscle"],
              example: "lose_weight",
            },
            dietPlan: {
              $ref: "#/components/schemas/DietPlan",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T12:00:00Z",
            },
            userId: {
              type: "number",
              example: 1,
            },
          },
        },
        GenerateDietResponse: {
          type: "object",

          properties: {
            id: {
              type: "number",
              example: 1,
            },

            dietPlan: {
              $ref: "#/components/schemas/DietPlan",
            },
          },
        },
        GenerateDietRequest: {
          type: "object",
          required: ["goal", "weight", "height", "age", "gender"],
          properties: {
            goal: {
              type: "string",
              enum: ["lose_weight", "gain_muscle"],
              example: "lose_weight",
            },
            weight: {
              type: "number",
              example: 70,
            },
            height: {
              type: "number",
              example: 180,
            },
            age: {
              type: "number",
              example: 30,
            },
            gender: {
              type: "string",
              enum: ["male", "female"],
              example: "male",
            },
            allergies: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["peanut", "milk"],
            },
            intolerances: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["gluten", "lactose"],
            },
          },
        },
        UpdateDietResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Diet plan updated successfully",
            },
            dietPlan: {
              $ref: "#/components/schemas/DietPlan",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
});
