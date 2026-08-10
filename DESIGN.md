---
name: Professora Márcia — Laboratório Colorido
description: Uma bancada digital lúdica e operacional para criar, distribuir e responder atividades de informática.
colors:
  marinho: "oklch(0.24 0.075 262)"
  marinho-2: "oklch(0.31 0.078 262)"
  creme: "oklch(0.968 0.021 92)"
  creme-2: "oklch(0.925 0.032 92)"
  tinta: "oklch(0.19 0.055 262)"
  eletrico: "oklch(0.62 0.21 258)"
  amarelo: "oklch(0.88 0.17 92)"
  coral: "oklch(0.7 0.18 25)"
  lima: "oklch(0.85 0.19 130)"
  primary: "oklch(0.62 0.21 258)"
  primary-dark: "oklch(0.24 0.075 262)"
  primary-light: "oklch(0.9 0.055 258)"
  student: "oklch(0.85 0.19 130)"
  student-dark: "oklch(0.38 0.11 132)"
  student-light: "oklch(0.93 0.09 130)"
  sun: "oklch(0.88 0.17 92)"
  sun-light: "oklch(0.93 0.12 92)"
  lab: "oklch(0.24 0.075 262)"
  lab-deep: "oklch(0.19 0.055 262)"
  cream: "oklch(0.968 0.021 92)"
  success: "oklch(0.35 0.1 140)"
  success-bg: "oklch(0.9 0.09 130)"
  warning: "oklch(0.4 0.11 60)"
  warning-bg: "oklch(0.91 0.1 92)"
  error: "oklch(0.4 0.15 25)"
  error-bg: "oklch(0.91 0.07 25)"
  info: "oklch(0.42 0.16 258)"
  info-bg: "oklch(0.9 0.055 258)"
  white: "oklch(0.968 0.021 92)"
  gray-50: "oklch(0.968 0.021 92)"
  gray-100: "oklch(0.925 0.032 92)"
  gray-200: "oklch(0.84 0.035 92)"
  gray-300: "oklch(0.74 0.032 92)"
  gray-400: "oklch(0.57 0.026 92)"
  gray-500: "oklch(0.46 0.025 92)"
  gray-600: "oklch(0.38 0.025 92)"
  gray-700: "oklch(0.29 0.035 262)"
  gray-900: "oklch(0.19 0.055 262)"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "3rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Archivo, sans-serif"
    fontSize: "2rem"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Nunito, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Nunito, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 900
    lineHeight: 1.5
  micro:
    fontFamily: "Nunito, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 900
    lineHeight: 1.4
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1.25rem"
  xl: "1.5rem"
  2xl: "2rem"
  3xl: "2.25rem"
  pill: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  base: "1rem"
  lg: "1.25rem"
  xl: "1.5rem"
  2xl: "2rem"
  3xl: "2.5rem"
  4xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.lab}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "0.75rem 1.25rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.sun-light}"
    textColor: "{colors.lab}"
  button-student:
    backgroundColor: "{colors.student}"
    textColor: "{colors.lab}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "0.75rem 1.25rem"
    height: "3rem"
  button-secondary:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.lab}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "0.75rem 1.25rem"
    height: "3rem"
  button-danger:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.lab}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "0.75rem 1.25rem"
    height: "3rem"
  card:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.lab}"
    rounded: "{rounded.3xl}"
    padding: "1.25rem"
  input:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.lab}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "0.625rem 1rem"
    height: "3rem"
  badge:
    backgroundColor: "{colors.creme-2}"
    textColor: "{colors.lab}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0.25rem 0.5rem"
---

# Design System: Professora Márcia

## Overview

**Creative North Star: "Laboratório Colorido"**

O produto se comporta como uma sala de informática transformada em bancada de experimentos: o azul-marinho envolve toda a experiência como a sala, o creme oferece superfícies legíveis de trabalho e as cores vivas funcionam como instrumentos. A expressão é lúdica e segura para alunos do 1º ao 9º ano, mas permanece operacional para a professora; toda cor, placa e ícone ajuda a encontrar ou concluir uma tarefa.

A interface combina tipografia de cartaz, contornos escuros e sombras sólidas com uma hierarquia de produto muito direta. O primeiro viewport sempre apresenta a próxima ação: entrar na bancada, criar uma atividade ou escolher o ano. Enfeites geométricos, grades de pontos e círculos radiais ambientam sem competir com formulários, navegação e estados do sistema.

**Key Characteristics:**

- Azul-marinho contínuo como ambiente e creme como superfície de trabalho.
- Amarelo para a ação principal, azul para ferramentas da professora, lima para o percurso do aluno e coral para ações destrutivas.
- Archivo pesado nos títulos e Nunito firme e amigável no corpo.
- Bordas escuras de 2–3px, cantos generosos e sombras deslocadas sem desfoque.
- Fluxos em português que explicitam a próxima operação e mantêm os alvos grandes.

## Colors

A paleta tem aparência de materiais escolares bem saturados sobre uma sala escura; as cores vivas comunicam função, não territórios decorativos arbitrários.

### Primary

- **Azul Instrumento** (`oklch(0.62 0.21 258)`): identifica ferramentas, informações e elementos da área da professora; sua versão clara colore fundos de ícones e badges.
- **Amarelo Experimento** (`oklch(0.88 0.17 92)`): marca a ação principal, o item ativo, o foco e os pequenos acentos de descoberta. A versão clara é o hover de ações amarelas.

### Secondary

- **Lima Descoberta** (`oklch(0.85 0.19 130)`): conduz o aluno, destaca o acesso sem senha e identifica atividades; a variação escura sustenta texto e sombra, e a clara sustenta fundos sem perder legibilidade.

### Tertiary

- **Coral Correção** (`oklch(0.7 0.18 25)`): reservado a perigo e exclusão. Não deve disputar a atenção com a ação principal.
- **Âmbar Aviso** (`oklch(0.4 0.11 60)`): informa cautela com fundo claro e texto escuro; não substitui o coral em erros ou destruição.

### Neutral

- **Azul Sala** (`oklch(0.24 0.075 262)`): plano de fundo global, cabeçalho e texto escuro estrutural.
- **Azul Sala Profunda** (`oklch(0.19 0.055 262)`): bordas e sombras que recortam controles e bancadas.
- **Creme Bancada** (`oklch(0.968 0.021 92)`): superfície principal de cards, painéis, campos e botões secundários.
- **Creme Suave** (`oklch(0.925 0.032 92)`): divisórias, badges neutros e estados desabilitados sem introduzir branco puro.
- **Cinzas Quentes** (`oklch(0.84 0.035 92)` a `oklch(0.29 0.035 262)`): gradação de texto secundário, placeholders e divisórias, sempre harmonizada com o creme.

### Named Rules

**The Functional Color Rule.** Amarelo significa agir ou selecionar; azul significa ferramenta da professora; lima significa percurso do aluno; coral significa perigo.

**The Dark Room Rule.** Páginas e cabeçalhos permanecem no Azul Sala; o creme entra como bancada delimitada, nunca como fundo genérico de toda a aplicação.

## Typography

**Display Font:** Archivo  
**Body Font:** Nunito

**Character:** Archivo produz placas compactas, fortes e imediatamente escaneáveis; Nunito suaviza formulários e instruções sem perder firmeza. A combinação é escolar sem ser infantilizada.

### Hierarchy

- **Display** (Archivo, 900, 3.75rem, line-height 0.95): muito compacto e com tracking negativo; usado em heróis e no nome da bancada.
- **Headline** (Archivo, 900, 3rem, line-height 1): usado nos títulos de página que precisam dominar o primeiro viewport.
- **Title** (Archivo, 900, 2rem, line-height 1.05): usado em seções, cards de destaque e títulos operacionais.
- **Body** (Nunito, 600, 1rem, line-height 1.5): base dos formulários e descrições; parágrafos importantes ficam entre 32 e 48rem para leitura rápida.
- **Label** (Nunito, 900, 0.875rem, line-height 1.5): controles, navegação, badges e metadados curtos; caixa normal é o padrão e tracking amplo aparece apenas em micro-rótulos da marca.

### Named Rules

**The Poster, Not Shouting Rule.** O impacto dos títulos vem de Archivo pesado, escala e composição; não transformar toda a interface em caixa alta.

## Layout

As superfícies operacionais usam contêiner central de até 72rem na área da professora e 64rem na área do aluno, com 1rem de respiro lateral que cresce para 1.5rem a partir de 640px. O ritmo vertical trabalha principalmente em passos de 1rem, 1.5rem, 2rem e 2.5rem; cards usam 1.25rem de padding e podem crescer para 1.5–2rem em superfícies de entrada.

No login, o conteúdo é uma coluna em telas estreitas e vira composição assimétrica com narrativa e card de 27rem a partir de 1024px. A narrativa longa some abaixo de 640px para manter login e acesso do aluno inteiros no primeiro viewport. No dashboard, o herói se divide em proporção 1.2/0.8 em desktop; os atalhos passam de uma coluna para três a partir de 768px.

A navegação da professora ocupa uma grade de quatro colunas em celulares de 320–375px e se torna uma fileira flexível em desktop. Os quatro destinos precisam permanecer visíveis, com rótulos compactos e alvo mínimo de 44px. Na área do aluno, a escolha de turma começa em duas colunas, cresce para três em 640px e quatro em 1024px.

**The First Action Rule.** O primeiro viewport deve revelar a tarefa primária sem depender de rolagem: autenticar, criar uma atividade ou escolher a turma.

**The 320px Rule.** Nenhum rótulo de navegação, botão ou card pode forçar rolagem horizontal a partir de 320px.

## Elevation & Depth

A profundidade é estrutural e gráfica: bordas escuras definem a peça e sombras sólidas, sem desfoque, fazem controles parecerem instrumentos colocados sobre a bancada. Hovers elevam o objeto de 1–4px e ampliam a sombra; o estado ativo retorna ao plano, sugerindo pressão física. O cabeçalho usa leve transparência e desfoque apenas para preservar contexto durante a rolagem.

### Shadow Vocabulary

- **Controle** (`3px 3px 0 var(--color-tinta)`): campos, badges, ícones e botões compactos.
- **Bancada** (`6px 6px 0 var(--color-tinta)`): cards e ações em repouso.
- **Bancada elevada** (`8px 8px 0 var(--color-tinta)`): hover de cards interativos.
- **Peça de destaque** (`9px 9px 0 var(--color-tinta)`): logo grande e quadro operacional do dashboard.

### Named Rules

**The Solid Shadow Rule.** Não usar sombra difusa, brilho ou glassmorphism; profundidade vem de deslocamento sólido e contorno escuro.

## Shapes

Controles e ícones usam cantos de 0.5–1.5rem; cards e painéis chegam a 2.25rem; botões usam 2rem, badges 1.25rem e a navegação combina topo arredondado com base curta. Bordas de 2px pertencem a controles e elementos pequenos, enquanto cards e seletores grandes usam 3px. Círculos aparecem em avatares, indicadores e ícones de feedback; rotações sutis e uma faixa semelhante a fita ficam reservadas a quadros especiais, não a toda lista.

**The Dark Edge Rule.** Toda superfície clara interativa precisa de borda Azul Sala Profunda; cor de área aparece no preenchimento, no ícone ou na sombra, sem remover a estrutura comum.

## Components

### Buttons

- **Shape:** retângulos de cantos generosos com borda escura de 2px e altura mínima de 44, 48 ou 56px conforme o tamanho.
- **Primary:** Amarelo Experimento com texto Azul Sala; é a ação dominante tanto para a professora quanto nos passos principais do sistema.
- **Student:** Lima Descoberta com texto Azul Sala; usado para começar ou avançar no percurso do aluno.
- **Secondary / Danger / Ghost:** creme para apoio, coral para destruição e transparente para ações discretas sobre fundos coloridos.
- **Hover / Focus:** hover eleva 2px e troca para a variação clara; foco usa contorno amarelo de 3px com offset de 3px; active remove a elevação. Desabilitado reduz opacidade e remove sombra/movimento.

### Badges and Poster Pills

- **Style:** badges compactos de borda escura de 2px e texto black; fundos claros de azul, lima ou âmbar informam categoria.
- **State:** o `poster-pill` amarelo introduz uma instrução curta no herói; badges de atividade descrevem tipo e nunca funcionam como único indicador de estado.

### Cards / Containers

- **Corner Style:** cantos generosos de 2.25rem no card canônico e 1.25–1.5rem em composições compactas.
- **Background:** Creme Bancada com texto Azul Sala; fundos branco-giz aparecem em hover e campos.
- **Shadow Strategy:** sombra Bancada em repouso e Bancada elevada em interação.
- **Border:** contorno Azul Sala Profunda de 3px.
- **Internal Padding:** 1.25rem como base, chegando a 1.5–2rem em cards de entrada e destaque.

### Inputs / Fields

- **Style:** fundo Creme Bancada, borda escura de 2px, canto de 1.5rem, altura mínima de 48px e label black acima do controle.
- **Focus:** retorna ao plano, reduz a sombra, troca a borda para Azul Instrumento e recebe o contorno global amarelo.
- **Error / Disabled:** erro usa texto e fundo próprios mais mensagem textual; desabilitado usa cinza quente e nunca depende apenas de opacidade.

### Feedback

- **Alerts:** superfície tonal por estado, borda estrutural escura, texto explícito e símbolo dentro de círculo Azul Sala.
- **Loading:** spinner de borda grossa com segmento amarelo e rótulo visível.
- **Empty states:** card creme com borda escura tracejada, ícone e mensagem acionável; nenhum estado vazio é apenas um buraco na página.

### Navigation

O cabeçalho é sticky, Azul Sala quase opaco, com borda inferior creme translúcida. A marca usa frasco amarelo e identifica explicitamente a área. Na professora, o item ativo é uma aba creme com sombra; itens inativos mantêm contraste claro e ganham preenchimento no hover. A grade móvel de quatro colunas é parte do contrato, não uma simplificação opcional.

### Logo

O símbolo é um frasco de laboratório em placa amarela com borda e sombra escuras, acompanhado por “Laboratório Colorido”, “Professora Márcia” e, quando houver contexto, o nome da área. A versão grande abre o login; a compacta ancora o cabeçalho.

## Do's and Don'ts

### Do:

- **Do** manter a história operacional clara: a professora entra na bancada, cria e acompanha; o aluno escolhe o ano e começa sem senha.
- **Do** reservar o amarelo para a ação principal, foco e seleção ativa.
- **Do** usar bordas escuras grossas, sombras sólidas e ícones de traço 2.5 como linguagem comum.
- **Do** preservar alvos de 44px ou mais, foco visível e redução de movimento quando solicitada pelo sistema.
- **Do** validar cada superfície em 320–375px e manter as quatro rotas da professora visíveis na grade móvel.

### Don't:

- **Don't** voltar ao mundo anterior de azul cobalto sobre fundo quente, laranja como identidade do aluno ou Inter como fonte única.
- **Don't** usar creme como fundo total da aplicação, nem substituir o Azul Sala por branco genérico.
- **Don't** introduzir gradientes decorativos multicoloridos, vidro, brilho, sombras difusas ou bordas finas cinza como linguagem principal.
- **Don't** transformar todos os textos em caixa alta ou usar cor como único sinal de estado.
- **Don't** esconder a ação principal abaixo de narrativa, decoração ou painéis secundários no primeiro viewport.
