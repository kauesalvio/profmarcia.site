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
  "username": "marcia",
  "email": "professora@escola.com",
  "passwordHash": "$2b$10$...",
  "name": "Professora Márcia",
  "createdAt": "ISO date"
}
```

**Índices:**
- `email` (unique)
- `username` (unique, quando preenchido)

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
  "config": {
    "questions": [
      {
        "label": "Qual foi o tema escolhido?",
        "type": "text",
        "options": [],
        "correctAnswer": null
      },
      {
        "label": "Qual é a capital do Brasil?",
        "type": "quiz",
        "options": ["São Paulo", "Rio de Janeiro", "Brasília"],
        "correctAnswer": "Brasília"
      },
      {
        "label": "Cruzadinha de informática",
        "type": "crossword",
        "words": [
          { "word": "MOUSE", "clue": "Periférico usado para apontar" },
          { "word": "TECLA" }
        ]
      },
      {
        "label": "Caça-palavras de informática",
        "type": "wordsearch",
        "words": [
          { "word": "MOUSE", "clue": "Periférico usado para apontar" },
          { "word": "TECLADO" },
          { "word": "MONITOR" }
        ],
        "gridSize": 10,
        "decoration": {
          "id": "id-publico-do-openverse",
          "title": "Computador",
          "creator": "Autor opcional",
          "license": "cc0",
          "sourceUrl": "https://fonte-da-imagem.example"
        }
      }
    ],
    "settings": {
      "kahootUrl": "https://kahoot.it/challenge/..."
    }
  },
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

**Campos importantes:**
- `classIds`: array de referências para `classes`. Indica para quais anos/classes a atividade será distribuída.
- `config.questions`: array de perguntas. Cada pergunta possui seu próprio `type` (`text`, `quiz`, `image-quiz`, `crossword`, `wordsearch`, etc.), permitindo misturar as dinâmicas na mesma atividade. Em `image-quiz`, `options` contém de duas a quatro referências de imagem e `correctAnswer` contém o ID da imagem correta.
- `config`: objeto flexível que varia conforme as perguntas. Nas perguntas `crossword` e `wordsearch`, cada palavra pode ter `word` (obrigatório) e `clue` (opcional).
- `config.questions[].decoration`: referência opcional e pequena a uma imagem do Openverse. **Não armazenar binário, base64 nem GridFS**; o arquivo permanece no provedor externo.
- `config.settings.kahootUrl`: link HTTPS opcional para a dinâmica final.

**Índices:**
- `classIds` (para consulta por ano/classe)
- `createdAt` (descendente)

---

### `responses`
Armazena as respostas dos alunos.

```json
{
  "_id": "ObjectId",
  "activityId": "ObjectId",
  "classIds": ["ObjectId"],
  "answers": [
    { "question": "Qual foi o tema escolhido?", "answer": "Meu animal favorito" }
  ],
  "submittedAt": "ISO date"
}
```

**Campos importantes:**
- `activityId`: referência para `activities`.
- `classIds`: anos/classes do aluno no momento da resposta.
- `answers`: array com as respostas.

**Índices:**
- `activityId` (essencial para análise)
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

### Buscar professor por usuário ou e-mail
```javascript
db.teachers.findOne({ $or: [{ username: "marcia" }, { email: "professora@escola.com" }] })
```

### Listar classes ordenadas por ano
```javascript
db.classes.find().sort({ year: 1 })
```

## Estratégia para o limite de 512 MB

Salvar no MongoDB:
- professora, turmas, estrutura textual das atividades, IDs/metadados mínimos das imagens e respostas dos alunos;
- datas e vínculos por `ObjectId`, necessários para distribuição e análise.

Não salvar:
- arquivos de imagem, miniaturas, base64, grades geradas de cruzadinha/caça-palavra ou respostas corretas expandidas;
- cache de buscas do Openverse e dados de sessão descartáveis.

As grades são geradas deterministicamente no navegador a partir das palavras. O maior crescimento tende a estar em `responses`; acompanhar o tamanho da collection e, quando necessário, exportar e apagar respostas antigas por período. Uma resposta textual pequena ocupa poucos KB, portanto 512 MB comporta dezenas de milhares de envios antes dos índices e da margem operacional, mas não deve ser tratado como armazenamento ilimitado.

## Considerações

- MongoDB Atlas M0 é gratuito e suficiente para o projeto inicial.
- Manter margem livre para índices e operações internas; não planejar usar os 512 MB integralmente.
- Cluster "dorme" após inatividade, mas acorda na primeira requisição.
- Recomendado criar um único usuário de banco com permissões limitadas.
- Nunca versionar a URI do MongoDB no código (usar `.env.local`).
