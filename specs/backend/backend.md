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
- Busca professor(a) no MongoDB pelo usuário ou e-mail.
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
- Sem `includeAnswers=true`, omite `correctAnswer` das perguntas de quiz para os alunos.
- Com `includeAnswers=true`, exige sessão válida da professora e preserva o gabarito completo.
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
    "classIds": ["id1", "id2"],
    "config": {
      "questions": [
        { "label": "Pergunta 1", "type": "text" },
        { "label": "Pergunta 2", "type": "quiz", "options": ["A", "B", "C"], "correctAnswer": "A" },
        {
          "label": "Cruzadinha",
          "type": "crossword",
          "words": [
            { "word": "MOUSE", "clue": "Periférico usado para apontar" },
            { "word": "TECLA" }
          ]
        },
        {
          "label": "Caça-palavras",
          "type": "wordsearch",
          "words": [
            { "word": "MOUSE", "clue": "Periférico usado para apontar" },
            { "word": "TECLADO" }
          ],
          "gridSize": 10,
          "decoration": {
            "id": "id-publico-do-openverse",
            "title": "Computador",
            "license": "cc0",
            "sourceUrl": "https://fonte-da-imagem.example"
          }
        }
      ],
      "settings": {
        "kahootUrl": "https://kahoot.it/challenge/..."
      }
    }
  }
  ```
- Validação: título, ao menos um `classId` e ao menos uma pergunta. Cada pergunta pode ser de tipos mistos (`text`, `quiz`, `image-quiz`, `crossword`, `wordsearch`, etc.). `image-quiz` exige de duas a quatro imagens válidas do Openverse e um `correctAnswer` correspondente ao ID de uma delas. Para `crossword` e `wordsearch`, a professora define as palavras (`word`) e as dicas (`clue`) são opcionais.
- Cada pergunta pode ter `decoration` opcional. Somente metadados e o ID público do Openverse são salvos; o arquivo da imagem nunca é persistido no MongoDB.
- `config.settings.kahootUrl` é opcional, aceita apenas HTTPS em domínios oficiais do Kahoot e aparece para o aluno depois do envio.

### `/api/imagens` - Busca de imagens decorativas

#### `GET /api/imagens?q=computador`
- Exige autenticação da professora.
- Faz proxy de busca para a API pública do Openverse, com conteúdo adulto desabilitado.
- Retorna no máximo 12 referências (`id`, título, autor, licença e URL da fonte).
- Não baixa nem persiste arquivos; as miniaturas continuam hospedadas pelo Openverse.

#### `GET /api/atividades/[id]`
- Sem `includeAnswers=true`, omite `correctAnswer`; com `includeAnswers=true`, exige sessão válida da professora e preserva o gabarito.
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
    "answers": [ ... ]
  }
  ```
- Valida respostas.
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
