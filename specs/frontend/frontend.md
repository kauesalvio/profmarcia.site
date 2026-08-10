# Especificação - Frontend

## Tecnologia

- **Next.js 14+** com App Router
- **React** para componentes de UI
- **TypeScript** para tipagem
- **Tailwind CSS** (sugestão) para estilização rápida
- Hospedado na **Vercel**

## Páginas

### 1. `/` - Login da Professora
- Formulário com usuário e senha.
- Envia credenciais para a API de autenticação.
- Em caso de sucesso, redireciona para `/professor`.
- Apenas professora autenticada acessa as rotas protegidas.

### 2. `/professor` - Painel da Professora
- Dashboard com ações principais:
  - Gerenciar classes/anos.
  - Criar nova atividade.
  - Ver análise de respostas.
- Layout simples e direto.

### 3. `/professor/classes` - Gerenciamento de Classes
- Lista classes/anos do 1º ao 9º ano.
- Permite adicionar, editar e excluir classes.
- Campos: nome e ano.

### 4. `/professor/atividades/nova` - Criação de Atividade
- Formulário com:
  - Título da atividade.
  - Descrição.
  - Seleção dos anos/classes para distribuição (checkboxes).
  - Perguntas com tipos mistos (quiz, formulário, cruzadinha, caça-palavra, etc.) na mesma atividade.
- Quiz com imagens: enunciado, de duas a quatro alternativas visuais e uma resposta correta.
- Renderização dinâmica do formulário de configuração por pergunta.
- Imagem decorativa opcional em cada pergunta, escolhida por busca no Openverse.
- Etapa final com link opcional do Kahoot; o endereço aparece após o aluno enviar a atividade.

### 5. `/professor/atividades` - Lista de Atividades
- Lista todas as atividades criadas.
- Filtro por ano/classe.
- Opções de editar, excluir e visualizar respostas.

### 6. `/professor/analise/[id]` - Análise de Respostas
- Seleciona uma atividade específica.
- Lista alunos que responderam com nome e respostas.
- Exibe situação dos alunos por atividade.

### 7. `/aluno` - Área do Aluno
- Página inicial para alunos (sem login).
- Seleção do ano/classe.
- Lista atividades disponíveis para aquele ano.

### 8. `/atividade/[id]` - Realização da Atividade
- Renderiza as perguntas conforme o tipo de cada uma (`quiz`, `text`, etc.).
- Coleta respostas e envia para a API.
- Exibe confirmação ao final e, quando configurado, o link cru do Kahoot.
- Cruzadinha e caça-palavra usam instruções numeradas, alvos de toque grandes e grade com rolagem nos tamanhos que não cabem na tela.

## Componentes

### Componentes de Layout
- `Header.tsx` - cabeçalho com navegação.
- `LayoutProfessor.tsx` - layout protegido para área da professora.

### Componentes de Atividades
Localizados em `components/activities/`:

- `Form.tsx` - formulário de texto livre.
- `Quiz.tsx` - quiz com alternativas.
- `ImageQuiz.tsx` - quiz com duas a quatro alternativas em imagem.
- `Crossword.tsx` - cruzadinha.
- `WordSearch.tsx` - caça-palavra.
- `Memory.tsx` - jogo da memória (futuro).

### Componentes de Formulário de Criação
- `YearClassSelector.tsx` - seleciona anos/classes de distribuição.
- `QuestionBuilder.tsx` - construtor de perguntas com suporte a quiz textual, quiz com imagens, formulário, cruzadinha e caça-palavra na mesma atividade.

## Fluxo do Usuário

### Professor
1. Acessa `/` e faz login.
2. Vai para `/professor`.
3. Cria classes/anos em `/professor/classes`.
4. Cria atividade em `/professor/atividades/nova`.
5. Configura perguntas (podendo misturar quiz, formulário, cruzadinha e caça-palavra) e escolhe anos/classes de distribuição.
6. Analisa respostas em `/professor/analise/[id]`.

### Aluno
1. Acessa `/aluno`.
2. Escolhe o ano/classe.
3. Seleciona uma atividade disponível.
4. Responde a atividade.
5. Envia e recebe confirmação.

## Segurança no Frontend
- Rotas de professor protegidas por sessão (NextAuth.js).
- Aluno não acessa rotas de professor.
- Validação básica de formulários antes do envio.

## MVP do Frontend
- Páginas: login, painel, gerenciamento de classes, criação de atividade, análise, área do aluno e realização de atividade.
- Componentes de atividade: `Form.tsx` e `Quiz.tsx`.
- Seleção de múltiplos anos/classes na criação.
