<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projeto

Site de aulas de informática (Next.js 16 App Router + TypeScript + Tailwind v4).
As especificações ficam em `specs/` e são a fonte de verdade: `specs/frontend/`,
`specs/backend/backend.md`, `specs/database/mongodb.md` e `specs/tech-spec.md`.

## Ambiente (Windows)

O Node não está no PATH padrão do shell; adicione antes dos comandos npm:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
```

## Verificação

```powershell
npx tsc --noEmit
npm run lint
npm run build
```

## Convenções

- Textos de interface em português, seguindo os labels de
  `specs/frontend/information-architecture.md` (seção 8).
- Design tokens de `specs/frontend/design-tokens.md` vivem no bloco `@theme` de
  `app/globals.css`; use utilitários Tailwind (`bg-primary`, `text-student-dark`, ...)
  em vez de hex solto.
- O lint usa as regras do React Compiler: nada de `setState` síncrono dentro de
  `useEffect` e listas de dependências precisam ser literais. Para ler
  `localStorage`/`sessionStorage`, use `lib/browserStore.ts`; para buscar dados,
  `lib/useResource.ts`.
- Área da professora usa a paleta `primary` (azul cobalto); área do aluno, `student` (laranja queimado #e85d04).
- `app/api/` + `lib/mock/db.ts` são um backend **mockado em memória** para visualizar o
  design. Devem ser substituídos pela implementação real (MongoDB + NextAuth.js) mantendo
  o mesmo contrato, sem alterar o frontend.
