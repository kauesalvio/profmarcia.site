# Design Tokens

Design tokens para o site de aulas de informática. Tokens únicos de origem para cores, tipografia, espaçamento e outros estilos visuais.

## 1. Cores

### Paleta Principal

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#0047AB` | Botões primários, links, destaques da área do professor |
| `--color-primary-dark` | `#003380` | Hover de botões primários |
| `--color-primary-light` | `#CCE0F5` | Fundos de destaque, badges |

### Paleta do Aluno

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-student` | `#E85D04` | Botões e destaques da área do aluno |
| `--color-student-dark` | `#B94A00` | Hover da área do aluno |
| `--color-student-light` | `#FFE8D6` | Fundos de destaque do aluno |

### Cores de Feedback

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-success` | `#2D6A4F` | Confirmação, sucesso no envio |
| `--color-success-bg` | `#D8F3DC` | Fundo de mensagens de sucesso |
| `--color-warning` | `#D00000` | Avisos |
| `--color-warning-bg` | `#FFCCD5` | Fundo de avisos |
| `--color-error` | `#9D0208` | Erros, campos inválidos |
| `--color-error-bg` | `#FFCCD5` | Fundo de mensagens de erro |
| `--color-info` | `#0077B6` | Informações |
| `--color-info-bg` | `#CAF0F8` | Fundo de informações |

### Tons de Cinza

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-white` | `#FFFFFF` | Fundo de cards e páginas |
| `--color-gray-50` | `#F7F5F0` | Fundo de páginas |
| `--color-gray-100` | `#F0EBE3` | Fundos alternados em listas |
| `--color-gray-200` | `#E5E0D6` | Bordas leves |
| `--color-gray-300` | `#CFC9BC` | Bordas de inputs |
| `--color-gray-500` | `#6B655A` | Textos secundários |
| `--color-gray-700` | `#3D3932` | Textos principais |
| `--color-gray-900` | `#1C1A16` | Títulos e textos de destaque |

## 2. Tipografia

### Fonte

| Token | Valor |
|-------|-------|
| `--font-family` | `Inter, system-ui, -apple-system, sans-serif` |

### Tamanhos

| Token | Valor | Uso |
|-------|-------|-----|
| `--font-size-xs` | `0.75rem` (12px) | Legendas, tags |
| `--font-size-sm` | `0.875rem` (14px) | Textos secundários |
| `--font-size-base` | `1rem` (16px) | Corpo de texto |
| `--font-size-lg` | `1.125rem` (18px) | Subtítulos |
| `--font-size-xl` | `1.25rem` (20px) | Títulos de seção |
| `--font-size-2xl` | `1.5rem` (24px) | Títulos de página |
| `--font-size-3xl` | `2rem` (32px) | Título principal |

### Pesos

| Token | Valor | Uso |
|-------|-------|-----|
| `--font-weight-normal` | `400` | Corpo |
| `--font-weight-medium` | `500` | Destaques |
| `--font-weight-semibold` | `600` | Títulos e labels |
| `--font-weight-bold` | `700` | Título principal, números |

### Altura da Linha

| Token | Valor | Uso |
|-------|-------|-----|
| `--line-height-tight` | `1.25` | Títulos |
| `--line-height-normal` | `1.5` | Corpo |
| `--line-height-relaxed` | `1.75` | Blocos maiores de texto |

## 3. Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` | `0.25rem` (4px) | Espaçamento mínimo |
| `--space-2` | `0.5rem` (8px) | Ícones pequenos, gaps |
| `--space-3` | `0.75rem` (12px) | Margens internas pequenas |
| `--space-4` | `1rem` (16px) | Padrão de padding e margin |
| `--space-5` | `1.25rem` (20px) | Cards internos |
| `--space-6` | `1.5rem` (24px) | Seções |
| `--space-8` | `2rem` (32px) | Espaçamento entre seções |
| `--space-10` | `2.5rem` (40px) | Espaçamento de página |
| `--space-12` | `3rem` (48px) | Containers largos |

## 4. Bordas

| Token | Valor | Uso |
|-------|-------|-----|
| `--border-radius-sm` | `0.25rem` (4px) | Tags, badges |
| `--border-radius-md` | `0.5rem` (8px) | Botões, inputs, cards |
| `--border-radius-lg` | `0.75rem` (12px) | Cards maiores |
| `--border-radius-xl` | `1rem` (16px) | Modais, containers |
| `--border-width` | `1px` | Bordas padrão |
| `--border-color` | `#E5E0D6` | Bordas de inputs e cards |

## 5. Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-sm` | `2px 2px 0 rgba(28, 26, 22, 0.12)` | Inputs, elementos pequenos |
| `--shadow-md` | `4px 4px 0 rgba(28, 26, 22, 0.14)` | Cards, botões elevados |
| `--shadow-lg` | `6px 6px 0 rgba(28, 26, 22, 0.16)` | Modais, dropdowns |

## 6. Transições

| Token | Valor | Uso |
|-------|-------|-----|
| `--transition-fast` | `150ms ease` | Hover de botões |
| `--transition-base` | `200ms ease` | Mudanças de estado |
| `--transition-slow` | `300ms ease` | Modais, expansões |

## 7. Breakpoints

| Token | Valor | Uso |
|-------|-------|-----|
| `--breakpoint-sm` | `640px` | Celulares |
| `--breakpoint-md` | `768px` | Tablets |
| `--breakpoint-lg` | `1024px` | Notebooks |
| `--breakpoint-xl` | `1280px` | Telas grandes |

## 8. Z-Index

| Token | Valor | Uso |
|-------|-------|-----|
| `--z-base` | `0` | Elementos normais |
| `--z-dropdown` | `10` | Dropdowns |
| `--z-sticky` | `20` | Cabeçalhos fixos |
| `--z-modal` | `30` | Modais |
| `--z-tooltip` | `40` | Tooltips |

## 9. Exemplo de Aplicação

### Card de Atividade (Professor)
```
background: --color-white
border: 1px solid --border-color
border-radius: --border-radius-md
padding: --space-4
box-shadow: --shadow-sm
```

### Botão Primário
```
background: --color-primary
color: --color-white
border-radius: --border-radius-md
padding: --space-3 --space-5
font-weight: --font-weight-medium
transition: --transition-fast
hover: background --color-primary-dark
```

### Botão do Aluno
```
background: --color-student
color: --color-white
border-radius: --border-radius-md
padding: --space-4 --space-6
font-size: --font-size-lg
font-weight: --font-weight-semibold
hover: background --color-student-dark
```

## 10. Acessibilidade

- Contraste mínimo 4.5:1 para textos.
- Botões com área de toque mínima de 44x44px.
- Foco visível com `outline: 2px solid --color-primary`.
- Evitar comunicação apenas por cor; usar ícones e textos.
