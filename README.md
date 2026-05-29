# 🧠 NutrIA API

API RESTful responsável pela autenticação, gerenciamento de usuários e geração inteligente de dietas utilizando IA generativa.

O projeto foi desenvolvido com foco em arquitetura organizada, segurança, separação de responsabilidades e integração com IA.

---

# 🚀 Tecnologias Utilizadas

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Zod
* Google Gemini API
* Express Rate Limit

---

# 🏗️ Arquitetura

A API foi estruturada utilizando separação de responsabilidades.

```txt
src/
 ├── controllers/
 ├── use-cases/
 ├── repositories/
 ├── middlewares/
 ├── validators/
 ├── providers/
 ├── interfaces/
 ├── errors/
 ├── routes/
 └── lib/
```

---

# 📌 Padrões Utilizados

## Repository Pattern

Abstração do acesso ao banco de dados.

---

## Dependency Injection

Injeção de dependências nos use cases e controllers.

---

## DTO Validation

Validação completa utilizando Zod.

---

## Centralized Error Handling

Tratamento centralizado de erros da aplicação.

---

# 🔐 Funcionalidades

## Auth

* Registro de usuários
* Login com JWT
* Middleware de autenticação
* Rotas protegidas

## Dietas

* Geração de dieta com IA
* Atualização inteligente da dieta
* Histórico de dietas
* Busca de dieta por ID
* Controle de acesso por usuário

## Segurança

* Hash de senha com bcrypt
* JWT
* Rate limiting
* Validação com Zod
* Tratamento robusto de erros

---

# 🤖 Integração com IA

A API utiliza Google Gemini para:

* gerar dietas personalizadas
* atualizar planos alimentares
* interpretar pedidos em linguagem natural

Além disso, a aplicação trata:

* indisponibilidade da IA
* respostas inválidas
* limite de requisições
* falhas externas

---

# 📚 Principais Rotas

## Auth

### POST /auth/register

Criação de conta.

### POST /auth/login

Login do usuário.

---

## Users

### GET /users/me

Retorna usuário autenticado.

---

## Diet

### POST /diet/generate

Gera dieta personalizada com IA.

### PATCH /diet/:id

Atualiza dieta através de prompt textual.

### GET /diet/my-plans

Lista dietas do usuário.

### GET /diet/:id

Busca dieta específica.

---

# ⚙️ Variáveis de Ambiente

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
GEMINI_API_KEY=
```

---

# ▶️ Como Rodar

## Instalar dependências

```bash
pnpm install
```

---

## Rodar migrations

```bash
npx prisma migrate deploy
```

---

## Ambiente de desenvolvimento

```bash
pnpm dev
```

---

## Build

```bash
pnpm build
```

---

## Produção

```bash
pnpm start
```

---

# 🌐 Deploy

API publicada utilizando:

* Render
* PostgreSQL
* Prisma ORM

---

# 🔗 Links

## Frontend

[[Deploy Front-end]](https://nutria-web-chi.vercel.app)

## API

[Deploy API](https://nutria-sgcd.onrender.com)

## Repositório Frontend

[COLE_SEU_GITHUB_FRONTEND_AQUI](https://github.com/p3drosantos/nutrIA-web)

---

# 🌟 Diferenciais

* Integração real com IA generativa
* Backend estruturado
* Tratamento robusto de erros
* Rate limiting
* Validação completa
* Fluxos reais de SaaS
* Deploy em produção
* Arquitetura escalável

---

# 📈 Melhorias Futuras

* Swagger/OpenAPI
* Testes automatizados
* Logs estruturados
* Observabilidade
* Cache
* Monitoramento

---

# 📄 Licença

MIT
