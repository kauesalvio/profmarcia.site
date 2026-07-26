# Especificação Técnica - Site de Aulas de Informática

## 1. Visão Geral

Site para apoio às aulas de informática de uma professora.
- Apenas a professora terá login restrito.
- Alunos acessam as atividades sem necessidade de login.
- Estrutura dividida por classes do 1º ao 9º ano.
- A professora poderá criar atividades dinâmicas para os alunos responderem.
- Primeira versão focada em simplicidade, com expansão futura para tipos de atividades mais interativos.

## 2. Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js (React) |
| Backend/API | Node.js via API Routes do Next.js |
| Banco de dados | MongoDB Atlas (plano gratuito M0) |
| Hospedagem | Vercel (gratuita) |
| Repositório | GitHub (único, não monorepo) |

## 3. Funcionalidades

### 3.1 Área da Professora
- Login com e-mail e senha armazenados no MongoDB (senha com hash).
- Painel para criar/editar/excluir classes do 1º ao 9º ano.
- Criar atividades com título, descrição, perguntas de tipos mistos (quiz, formulário, cruzadinha, caça-palavra) e seleção dos anos/classes de distribuição.
- Tipos de perguntas previstos: **Quiz**, **Formulário**, **Cruzadinha**, **Caça-palavra** (MVP) e **Memória** (futuro).
- Configurar cada pergunta de acordo com o tipo selecionado, permitindo misturar tipos dentro de uma mesma atividade.
- Selecionar uma atividade e visualizar as respostas enviadas.

### 3.2 Área dos Alunos
- Acessar sem login.
- Escolher a classe (1º ao 9º ano).
- Ver atividades disponíveis para aquela classe.
- Participar das atividades disponíveis (quiz, formulário, cruzadinha, caça-palavra, jogo da memória, etc.).
- Enviar respostas sem necessidade de login.

## 4. Estrutura do Projeto

```
informatic-class/
├── specs/
│   └── tech-spec.md
├── app/
│   ├── page.tsx                 → login da professora
│   ├── professor/
│   │   └── page.tsx             → painel da professora
│   ├── aluno/
│   │   └── page.tsx             → escolha da classe
│   ├── atividade/
│   │   └── [id]/
│   │       └── page.tsx         → responder uma atividade
│   └── api/
│       ├── login/route.ts       → autenticação simples da professora
│       ├── classes/route.ts     → CRUD de classes
│       ├── atividades/route.ts  → CRUD de atividades
│       └── respostas/route.ts   → salvar/listar respostas
├── components/
│   ├── activities/
│   │   ├── Quiz.tsx
│   │   ├── Form.tsx
│   │   ├── Crossword.tsx
│   │   ├── WordSearch.tsx
│   │   └── Memory.tsx
├── lib/
│   └── mongodb.ts               → conexão com MongoDB Atlas
├── models/
│   ├── Teacher.ts
│   ├── Class.ts
│   ├── Activity.ts
│   └── Response.ts
├── .env.local
├── package.json
└── README.md
```

## 5. Modelos de Dados (MongoDB)

### Teacher
```json
{
  "_id": "ObjectId",
  "email": "professora@escola.com",
  "passwordHash": "$2b$10$...",
  "name": "Professora Ana",
  "createdAt": "ISO date"
}
```

### Class
```json
{
  "_id": "ObjectId",
  "name": "6º Ano A",
  "year": 6
}
```

### Activity
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
        "gridSize": 10
      }
    ],
    "settings": {}
  },
  "createdAt": "ISO date"
}
```

#### Tipos de perguntas

| Tipo | Descrição | Complexidade |
|------|-----------|--------------|
| **Formulário (text)** | Campos de texto livre para resposta. | Baixa (MVP) |
| **Quiz** | Perguntas com alternativas e resposta correta. | Baixa (MVP) |
| **Cruzadinha** | Palavras cruzadas geradas a partir de dicas. | Média (MVP) |
| **Caça-palavra** | Grade com palavras a serem encontradas. | Média (MVP) |
| **Memória** | Jogo de cartas com pares. | Média (futuro) |

Cada pergunta dentro de `config.questions` possui seu próprio `type`, permitindo misturar tipos dentro da mesma atividade. Nas perguntas `crossword` e `wordsearch`, o campo `clue` de cada palavra é opcional: a professora define as palavras e pode ou não adicionar dicas.

### Response
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

## 6. Fluxo de Uso

1. Professora acessa o site e faz login com e-mail e senha.
2. Cria as classes do 1º ao 9º ano.
3. Cria atividades vinculadas às classes/anos.
4. Configura as perguntas da atividade, podendo misturar quiz, formulário, cruzadinha e caça-palavra.
5. Seleciona para quais anos/classes a atividade será distribuída.
6. Compartilha o link da área do aluno.
7. Aluno escolhe a classe/ano e visualiza as atividades disponíveis para aquele ano.
8. Aluno participa da dinâmica e envia a resposta.
9. Professora acessa a tela de análise, seleciona uma atividade e visualiza as respostas enviadas.

## 7. Hospedagem

- **Frontend + backend**: Vercel (plano gratuito).
- **Banco de dados**: MongoDB Atlas M0 (512 MB, gratuito).
- **Repositório**: GitHub, com deploy automático para Vercel.

## 8. Variáveis de Ambiente

```
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/escola?retryWrites=true&w=majority
NEXTAUTH_SECRET=chave_secreta_para_sessao
```

## 9. Primeiros Passos

1. Criar repositório no GitHub.
2. Inicializar projeto Next.js com TypeScript.
3. Configurar MongoDB Atlas.
4. Criar as rotas de API.
5. Construir as telas de professor e aluno.
6. Fazer deploy na Vercel.

## 10. MVP vs Funcionalidades Futuras

### MVP (versão inicial)
- Login da professora com MongoDB.
- CRUD de classes do 1º ao 9º ano.
- Criação de atividades com perguntas do tipo **Formulário**, **Quiz**, **Cruzadinha** e **Caça-palavra** (podendo misturar na mesma atividade).
- Aluno acessa sem login e responde.
- Tela de análise da professora por atividade.

### Funcionalidades futuras
- Novos tipos de perguntas, como o jogo da memória.
- Sistema de autenticação mais robusto para a professora.
- Exportação de notas em planilha.
- Login opcional para alunos acompanharem histórico.
- Dashboard com estatísticas de respostas.
- Separação em monorepo caso o projeto cresça muito.
