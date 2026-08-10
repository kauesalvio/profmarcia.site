# Design Tokens — Laboratório Colorido

Fonte de verdade visual do site. Os tokens implementados ficam no bloco `@theme` de `app/globals.css`.

## 1. Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-marinho` | `oklch(0.24 0.075 262)` | Fundo global e controles escuros |
| `--color-marinho-2` | `oklch(0.31 0.078 262)` | Painéis escuros e hovers |
| `--color-tinta` | `oklch(0.19 0.055 262)` | Bordas, texto estrutural e sombras |
| `--color-creme` | `oklch(0.968 0.021 92)` | Cards, campos e superfícies de trabalho |
| `--color-creme-2` | `oklch(0.925 0.032 92)` | Superfícies secundárias |
| `--color-eletrico` | `oklch(0.62 0.21 258)` | Ferramentas da professora e informação |
| `--color-amarelo` | `oklch(0.88 0.17 92)` | Ação principal, foco e seleção |
| `--color-coral` | `oklch(0.7 0.18 25)` | Exclusão, perigo e acentos |
| `--color-lima` | `oklch(0.85 0.19 130)` | Área do aluno e estados concluídos |

Os aliases `primary`, `student`, `sun`, `lab` e `cream` continuam disponíveis para compatibilidade. Em código novo, prefira os nomes do Laboratório Colorido.

## 2. Tipografia

| Papel | Fonte | Peso | Regra |
|---|---|---|---|
| Títulos | Archivo | 900 | Caixa alta, `line-height: 0.95`, tracking `-0.01em` |
| Corpo | Nunito | 600 | Mínimo de 16 px em textos e campos no celular |
| Labels | Nunito | 900 | Caixa alta apenas em micro-rótulos e badges |

Use a classe `titulo-caixa` para títulos de página e seção. O impacto vem de escala e peso; textos corridos permanecem em caixa normal.

## 3. Forma e profundidade

| Elemento | Borda | Raio | Sombra |
|---|---|---|---|
| Card | `3px solid tinta` | `2rem` | `6px 6px 0 tinta` |
| Controle | `2px solid tinta` | `0.75rem` | `3px 3px 0 tinta` |
| Botão | `2px solid tinta` | `1rem` | `3px 3px 0 tinta` |
| Badge | `2px solid tinta` | `0.5rem` | sem sombra por padrão |

Sombras são sempre sólidas e sem desfoque. Superfícies claras interativas mantêm borda escura.

## 4. Espaçamento e layout

- Escala principal: `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`.
- Contêiner da professora e entrada: máximo de `72rem`.
- Área do aluno: até `72rem`, com listas em uma coluna no celular e duas no desktop.
- Padding lateral: `1rem`, crescendo para `1.5rem` a partir de 640 px.
- Alvos interativos: mínimo de `44 × 44px`.
- A navegação da professora mantém quatro destinos visíveis, em quatro colunas no celular.

## 5. Movimento e acessibilidade

- Hover pode elevar o elemento entre 1 e 4 px; `active` volta ao plano.
- Foco visível: `3px solid amarelo`, com offset de 3 px.
- Contraste mínimo de 4.5:1 para textos.
- Estados nunca dependem apenas de cor.
- `prefers-reduced-motion` desativa animações e transições não essenciais.
