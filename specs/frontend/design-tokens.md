# Design Tokens

Design tokens para o site de aulas de informática. Tokens únicos de origem para cores, tipografia, espaçamento e outros estilos visuais.

## 1. Cores

### Paleta Principal

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#2563EB` | Botões primários, links, destaques da área do professor |
| `--color-primary-dark` | `#1D4ED8` | Hover de botões primários |
| `--color-primary-light` | `#DBEAFE` | Fundos de destaque, badges |

### Paleta do Aluno

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-student` | `#10B981` | Botões e destaques da área do aluno |
| `--color-student-dark` | `#059669` | Hover da área do aluno |
| `--color-student-light` | `#D1FAE5` | Fundos de destaque do aluno |

### Cores de Feedback

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-success` | `#22C55E` | Confirmação, sucesso no envio |
| `--color-success-bg` | `#DCFCE7` | Fundo de mensagens de sucesso |
| `--color-warning` | `#F59E0B` | Avisos |
| `--color-warning-bg` | `#FEF3C7` | Fundo de avisos |
| `--color-error` | `#EF4444` | Erros, campos inválidos |
| `--color-error-bg` | `#FEE2E2` | Fundo de mensagens de erro |
| `--color-info` | `#3B82F6` | Informações |
| `--color-info-bg` | `#DBEAFE` | Fundo de informações |

### Tons de Cinza

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-white` | `#FFFFFF` | Fundo de cards e páginas |
| `--color-gray-50` | `#F9FAFB` | Fundo de páginas |
| `--color-gray-100` | `#F3F4F6` | Fundos alternados em listas |
| `--color-gray-200` | `#E5E7EB` | Bordas leves |
| `--color-gray-300` | `#D1D5DB` | Bordas de inputs |
| `--color-gray-500` | `#6B7280` | Textos secundários |
| `--color-gray-700` | `#374151` | Textos principais |
| `--color-gray-900` | `#111827` | Títulos e textos de destaque |

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
| `--border-color` | `#E5E7EB` | Bordas de inputs e cards |

## 5. Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Inputs, elementos pequenos |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Cards, botões elevados |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modais, dropdowns |

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
