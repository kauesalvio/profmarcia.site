# Especificação - Backend

## Tecnologia

- **Node.js** via API Routes do **Next.js** App Router
- **TypeScript**
- **NextAuth.js** (sugestão) para autenticação da professora
- **bcrypt** para hash de senha
- Conexão com **MongoDB Atlas** via driver nativo ou Mongoose

## Estrutura de API

Todas as rotas estão em `app/api/`.

### `/api/auth/[...nextauth]` - Autenticação
- Provider `credentials`.
- Busca professor(a) no MongoDB pelo e-mail.
- Compara senha com `bcrypt.compare`.
- Cria sessão JWT em cookie.
- Protege rotas de professor.

### `/api/classes` - CRUD de Classes

#### `GET /api/classes`
- Lista todas as classes/anos.
- Ordenação por ano.

#### `POST /api/classes`
- Cria nova classe.
- Body: `{ name, year }`.
- Valida duplicidade.

#### `PUT /api/classes/[id]`
- Atualiza nome ou ano de uma classe.

#### `DELETE /api/classes/[id]`
- Remove classe.
- Verifica se há atividades vinculadas (opcional no MVP).

### `/api/atividades` - CRUD de Atividades

#### `GET /api/atividades`
- Lista atividades.
- Query opcional: `classId` para filtrar por ano/classe.
- Retorna atividades com `classIds` populados ou não.

#### `POST /api/atividades`
- Cria nova atividade.
- Body:
  ```json
  {
    "title": "Atividade de Word",
    "description": "...",
    "type": "quiz",
    "classIds": ["id1", "id2"],
    "config": { ... }
  }
  ```
- Validação: título, tipo e ao menos um `classId`.

#### `GET /api/atividades/[id]`
- Retorna detalhes de uma atividade específica.

#### `PUT /api/atividades/[id]`
- Atualiza atividade.

#### `DELETE /api/atividades/[id]`
- Remove atividade e respostas associadas (ou mantém histórico).

### `/api/respostas` - Respostas dos Alunos

#### `POST /api/respostas`
- Aluno envia resposta de uma atividade.
- Body:
  ```json
  {
    "activityId": "...",
    "classIds": ["..."],
    "studentName": "Maria Silva",
    "answers": [ ... ]
  }
  ```
- Valida nome e respostas.
- Salva no MongoDB.

#### `GET /api/respostas`
- Lista respostas.
- Query opcional: `activityId`.
- Usado pela tela de análise da professora.

## Regras de Negócio

- Apenas professor(a) autenticada pode criar, editar, excluir e analisar.
- Alunos acessam sem autenticação.
- Atividades são visíveis apenas para os anos/classes selecionados na criação.
- Um aluno pode responder a mesma atividade mais de uma vez (MVP).
- Senhas nunca trafegam ou são armazenadas em texto plano.

## Segurança

- Hash de senha com `bcrypt` (custo 10).
- Sessão via JWT com `NEXTAUTH_SECRET`.
- Validação de inputs nas rotas.
- Proteção CORS configurada na Vercel.
- Variáveis sensíveis em `.env.local`.

## Tratamento de Erros

- Retornar status HTTP apropriados:
  - `200` sucesso
  - `201` criado
  - `400` bad request
  - `401` não autorizado
  - `404` não encontrado
  - `500` erro interno
- Respostas de erro em JSON: `{ error: "mensagem" }`.

## Conexão com MongoDB

- Cliente singleton em `lib/mongodb.ts`.
- Reutiliza conexão entre requisições serverless.
- Fecha conexão apenas em caso de erro grave.

## MVP do Backend
- Autenticação com NextAuth.js + MongoDB.
- CRUD completo de classes.
- CRUD de atividades com `classIds`.
- Criação e listagem de respostas.
- Proteção de rotas de professor.
