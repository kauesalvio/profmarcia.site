# Aulas de Informática

Site de apoio às aulas de informática. A professora cria atividades com perguntas de tipos
mistos (quiz, formulário, cruzadinha e caça-palavra) e os alunos do 1º ao 9º ano respondem
sem precisar de login.

- Área da professora: login com usuário ou e-mail e senha, cadastro de turmas do 1º ao 9º ano, criação
  de atividades e análise das respostas.
- Área do aluno: escolhe o ano, vê as atividades disponíveis e responde sem cadastro.

Especificações em [`specs/`](./specs).

## Tecnologias

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- MongoDB
- NextAuth.js (sessão da professora)

## Como rodar

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

### Variáveis de ambiente

Copie `.env.example` (se existir) ou crie um `.env.local`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/escola
NEXTAUTH_SECRET=um-segredo-forte
NEXTAUTH_URL=http://localhost:3000
```

Rode `npx tsx scripts/seed.mjs` (ou `node scripts/seed.mjs`) para criar a professora e as
9 turmas iniciais.

## Estrutura

```
app/
├── api/                              rotas de API (login, classes, atividades, respostas)
├── page.tsx                          login da professora
├── professor/                        área protegida (painel, turmas, atividades, análise)
├── aluno/                            escolha do ano + atividades disponíveis
└── atividade/[id]/                   atividade e confirmação de envio
components/
├── activities/                       Quiz, Form, Crossword, WordSearch (MVP) e stub de Memória
├── builders/                         QuestionBuilder, YearClassSelector
├── layout/                           Header, LayoutProfessor
├── professor/                        formulários de turma e de atividade
└── ui/                               botões, campos, cards e estados de feedback
lib/
├── api.ts                            cliente das rotas descritas em specs/backend/backend.md
├── auth.ts                           sessão da professora no cliente (NextAuth.js)
├── browserStore.ts                   leitura reativa de local/sessionStorage
├── labels.ts                         labels em português e anos escolares
├── mongodb.ts                        conexão com o MongoDB
├── puzzle.ts                         geração das grades de cruzadinha e caça-palavra
├── server/mongo.ts                   serialização e normalização dos documentos do MongoDB
├── session.ts                        sessão no servidor (cookie httpOnly)
├── student.ts                        turma escolhida pelo aluno no navegador
├── types.ts                          tipos das entidades (Class, Activity, Response)
└── useResource.ts                    hook de carregamento com loading/erro/recarga
```

Os design tokens de `specs/frontend/design-tokens.md` estão em `app/globals.css` (bloco
`@theme` do Tailwind v4).

## Modelo de dados

A fonte de verdade está em `specs/database/mongodb.md`. Principais coleções:

- `teachers` — professora (usuário, e-mail e senha com hash).
- `classes` — turmas do 1º ao 9º ano.
- `activities` — atividades com `config.questions` (perguntas de tipos mistos) e `classIds`.
- `responses` — respostas dos alunos, sem `studentName`.

## Verificação

```powershell
npx tsc --noEmit
npm run lint
npm run build
```
