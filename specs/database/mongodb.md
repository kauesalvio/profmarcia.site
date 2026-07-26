# Especificação - MongoDB

## Provedor

- **MongoDB Atlas** - cluster M0 (gratuito)
- 512 MB de armazenamento
- Banco de dados sugerido: `escola`

## URI de Conexão

```
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/escola?retryWrites=true&w=majority
```

## Collections

### `teachers`
Armazena dados de login da professora.

```json
{
  "_id": "ObjectId",
  "email": "professora@escola.com",
  "passwordHash": "$2b$10$...",
  "name": "Professora Ana",
  "createdAt": "ISO date"
}
```

**Índices:**
- `email` (unique)

**Observação:** a senha deve ser armazenada com hash bcrypt.

---

### `classes`
Armazena as classes/anos do 1º ao 9º ano.

```json
{
  "_id": "ObjectId",
  "name": "6º Ano A",
  "year": 6,
  "createdAt": "ISO date"
}
```

**Índices:**
- `year` (para ordenação)
- `name` (unique, opcional)

---

### `activities`
Armazena as atividades criadas pela professora.

```json
{
  "_id": "ObjectId",
  "classIds": ["ObjectId"],
  "title": "Atividade de Word",
  "description": "Crie um documento com título e parágrafo.",
  "type": "quiz",
  "config": {
    "questions": [
      {
        "label": "Qual foi o tema escolhido?",
        "type": "text",
        "options": [],
        "correctAnswer": null
      }
    ],
    "settings": {}
  },
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

**Campos importantes:**
- `classIds`: array de referências para `classes`. Indica para quais anos/classes a atividade será distribuída.
- `type`: tipo da dinâmica (`quiz`, `form`, `crossword`, `wordsearch`, `memory`).
- `config`: objeto flexível que varia conforme o tipo.

**Índices:**
- `classIds` (para consulta por ano/classe)
- `type` (para filtros futuros)
- `createdAt` (descendente)

---

### `responses`
Armazena as respostas dos alunos.

```json
{
  "_id": "ObjectId",
  "activityId": "ObjectId",
  "classIds": ["ObjectId"],
  "studentName": "Maria Silva",
  "answers": [
    { "question": "Qual foi o tema escolhido?", "answer": "Meu animal favorito" }
  ],
  "submittedAt": "ISO date"
}
```

**Campos importantes:**
- `activityId`: referência para `activities`.
- `classIds`: anos/classes do aluno no momento da resposta.
- `studentName`: nome informado pelo aluno.
- `answers`: array com as respostas.

**Índices:**
- `activityId` (essencial para análise)
- `studentName` (para busca por aluno)
- `submittedAt` (descendente)

## Relacionamentos

```
teachers (1) ----> (N) não se relaciona diretamente
classes (N) <---- (N) activities
classes (N) <---- (N) responses
activities (1) <---- (N) responses
```

Relacionamentos N:N entre `classes` e `activities` via `classIds`.
Relacionamentos N:N entre `classes` e `responses` via `classIds`.

## Principais Queries

### Listar atividades por ano/classe
```javascript
db.activities.find({ classIds: { $in: [ObjectId("...")] } }).sort({ createdAt: -1 })
```

### Listar respostas de uma atividade
```javascript
db.responses.find({ activityId: ObjectId("...") }).sort({ submittedAt: -1 })
```

### Buscar professor por e-mail
```javascript
db.teachers.findOne({ email: "professora@escola.com" })
```

### Listar classes ordenadas por ano
```javascript
db.classes.find().sort({ year: 1 })
```

## Considerações

- MongoDB Atlas M0 é gratuito e suficiente para o projeto inicial.
- 512 MB comporta milhares de atividades e respostas.
- Cluster "dorme" após inatividade, mas acorda na primeira requisição.
- Recomendado criar um único usuário de banco com permissões limitadas.
- Nunca versionar a URI do MongoDB no código (usar `.env.local`).
