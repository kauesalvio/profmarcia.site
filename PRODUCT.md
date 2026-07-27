# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Professora Márcia**: professora de informática que dá aulas para turmas do 1º ao 9º ano. Usa o site para criar turmas, montar atividades dinâmicas (quiz, formulário, cruzadinha, caça-palavra) e analisar as respostas dos alunos.
- **Alunos**: estudantes do 1º ao 9º ano que acessam sem login, escolhem sua turma e respondem as atividades disponíveis.
- **Público secundário**: pais, coordenadores ou outros professores que possam acessar o link da área do aluno.

## Product Purpose

Site de apoio às aulas de informática da Professora Márcia. Permite criar e distribuir atividades interativas para alunos do 1º ao 9º ano, sem exigir login dos estudantes. A professora gerencia turmas, monta atividades com perguntas de tipos mistos e acompanha as respostas enviadas.

## Positioning

Aula de informática personalizada: uma única professora cria atividades sob medida para suas turmas, misturando quiz, formulário, cruzadinha e caça-palavra em uma mesma atividade — sem plataforma genérica, sem burocracia de cadastro para o aluno.

## Operating Context

- Usado em sala de aula com projetores, tablets e computadores.
- Interface deve ser simples, com botões grandes e feedback imediato.
- Textos em português, termos familiares a professores (turmas, atividades, ver respostas).
- O aluno acessa pelo link `/aluno` e escolhe a turma a cada sessão.
- Backend mockado em memória (`app/api/` + `lib/mock/db.ts`) para visualização do design; contrato deve ser preservado quando substituído por MongoDB + NextAuth.js.

## Capabilities and Constraints

- Login restrito à professora (e-mail + senha) via sessão mockada.
- Aluno não faz login e não acessa rotas protegidas da professora.
- CRUD de turmas/anos do 1º ao 9º ano.
- Criação de atividades com título, descrição, distribuição por turmas e perguntas de tipos mistos.
- Tipos de pergunta suportados: formulário (`text`/`textarea`), quiz, cruzadinha, caça-palavra. Memória previsto para o futuro.
- Análise de respostas por atividade, listando alunos e respostas.
- Hospedado na Vercel; banco MongoDB Atlas M0.
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, ESLint com regras do React Compiler.

## Brand Commitments

- Nome/identidade: **Professora Márcia**.
- Cores distintas por área: azul (`primary`) para a professora; verde (`student`) para o aluno.
- Tom de voz: amigável, direto, sem jargão técnico.
- Design tokens em `specs/frontend/design-tokens.md` e `@theme` de `app/globals.css`.
- Textos de interface em português conforme `specs/frontend/information-architecture.md` (seção 8).

## Evidence on Hand

- Especificações completas em `specs/`.
- Implementação frontend existente em `app/`, `components/`, `lib/`.
- Backend mockado em memória; sem dados reais de alunos ou professora.
- Sem logo, fotos, depoimentos ou assets reais de marca.

## Product Principles

1. **Sem burocracia para o aluno**: acesso direto, sem login, foco total na atividade.
2. **Controle da professora**: a professora cria, organiza e acompanha tudo.
3. **Clareza em sala de aula**: botões grandes, feedback imediato, linguagem familiar.
4. **Flexibilidade de atividades**: misturar tipos de perguntas em uma mesma atividade.
5. **Expansível sem quebrar o básico**: MVP simples, com caminho para novos tipos e funcionalidades.

## Accessibility & Inclusion

- Contraste mínimo 4.5:1 para textos.
- Botões e áreas de toque mínimas de 44×44 px.
- Foco visível em todos os elementos interativos.
- Evitar comunicação apenas por cor, usando ícones e textos.
- Reduzir animações quando `prefers-reduced-motion` estiver ativo.
