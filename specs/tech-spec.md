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
- Criar atividades com título, descrição, tipo de dinâmica e seleção dos anos/classes de distribuição.
- Tipos de atividades previstos: **Quiz**, **Formulário**, **Cruzadinha**, **Caça-palavra**, **Memória**.
- Configurar cada atividade de acordo com o tipo selecionado.
- Selecionar uma atividade e visualizar a situação dos alunos (quem respondeu e as respostas).

### 3.2 Área dos Alunos
- Acessar sem login.
- Escolher a classe (1º ao 9º ano).
- Ver atividades disponíveis para aquela classe.
- Preencher o nome antes de iniciar uma atividade.
- Participar da dinâmica escolhida pela professora (quiz, formulário, jogo da memória, etc.).
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
  "createdAt": "ISO date"
}
```

#### Tipos de atividades

| Tipo | Descrição | Complexidade |
|------|-----------|--------------|
| **Formulário** | Campos de texto livre para resposta. | Baixa (MVP) |
| **Quiz** | Perguntas com alternativas e resposta correta. | Baixa (MVP) |
| **Cruzadinha** | Palavras cruzadas geradas a partir de dicas. | Média (futuro) |
| **Caça-palavra** | Grade com palavras a serem encontradas. | Média (futuro) |
| **Memória** | Jogo de cartas com pares. | Média (futuro) |

A estrutura do campo `config` varia conforme o `type` da atividade.

### Response
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

## 6. Fluxo de Uso

1. Professora acessa o site e faz login com e-mail e senha.
2. Cria as classes do 1º ao 9º ano.
3. Cria atividades vinculadas às classes/anos e escolhe o tipo de dinâmica (quiz, formulário, etc.).
4. Seleciona para quais anos/classes a atividade será distribuída.
5. Configura a atividade de acordo com o tipo selecionado.
6. Compartilha o link da área do aluno.
7. Aluno escolhe a classe/ano e visualiza as atividades disponíveis para aquele ano.
8. Aluno preenche o nome antes de iniciar uma atividade.
9. Aluno participa da dinâmica e envia a resposta.
10. Professora acessa a tela de análise, seleciona uma atividade e visualiza a situação dos alunos.

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
- Criação de atividades do tipo **Formulário** e **Quiz**.
- Aluno acessa sem login, preenche o nome e responde.
- Tela de análise da professora por atividade.

### Funcionalidades futuras
- Tipos de atividades: Cruzadinha, Caça-palavra, Memória.
- Sistema de autenticação mais robusto para a professora.
- Exportação de notas em planilha.
- Login opcional para alunos acompanharem histórico.
- Dashboard com estatísticas de respostas.
- Separação em monorepo caso o projeto cresça muito.
