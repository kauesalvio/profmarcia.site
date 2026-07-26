# Aulas de Informática

Site de apoio às aulas de informática: a professora cria atividades com perguntas de tipos
mistos (quiz, formulário, cruzadinha e caça-palavra) e os alunos do 1º ao 9º ano respondem
sem precisar de login.

Especificações em [`specs/`](./specs). Este repositório contém, por enquanto, **apenas o
frontend** (Next.js App Router + TypeScript + Tailwind CSS).

## Como rodar

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Estrutura

```
app/
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
├── auth.ts                           sessão da professora no cliente (substituir por NextAuth.js)
├── browserStore.ts                   leitura reativa de local/sessionStorage
├── labels.ts                         labels em português e anos escolares
├── puzzle.ts                         geração das grades de cruzadinha e caça-palavra
├── types.ts                          tipos das entidades (Class, Activity, Response)
└── useResource.ts                    hook de carregamento com loading/erro/recarga
```

Os design tokens de `specs/frontend/design-tokens.md` estão em `app/globals.css` (bloco
`@theme` do Tailwind v4).

## Backend mockado (temporário)

As telas consomem as rotas de `specs/backend/backend.md` (`/api/login`, `/api/classes`,
`/api/atividades`, `/api/respostas`). O backend real (MongoDB + NextAuth.js) ainda não
existe, então `app/api/` e `lib/mock/db.ts` trazem uma versão **em memória** só para
visualizar o design:

- o login aceita qualquer e-mail e senha;
- já vêm 9 turmas (1º ao 9º ano), 3 atividades (2 quiz + 1 formulário) e 3 respostas;
- criar, editar e excluir funciona, mas tudo se perde ao reiniciar o servidor.

Ao implementar o backend de verdade, apague `lib/mock/db.ts` e substitua os handlers de
`app/api/` (o frontend não precisa mudar).
