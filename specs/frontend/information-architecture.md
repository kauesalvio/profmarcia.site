# Arquitetura de Informação - Frontend

## 1. Objetivo

Organizar a estrutura, navegação e fluxos de informação do site de aulas de informática, garantindo que professora e alunos encontrem facilmente o que precisam.

## 2. Públicos

| Público | Acesso | Ações principais |
|---------|--------|------------------|
| **Professora** | Login obrigatório | Criar classes, criar atividades, distribuir por anos, analisar respostas |
| **Aluno** | Sem login | Escolher ano, ver atividades, responder atividades |

## 3. Mapa do Site

```
/
├── /professor                    ← protegido (login)
│   ├── /classes
│   │   └── /[id]/editar
│   ├── /atividades
│   │   ├── /nova
│   │   └── /[id]
│   │       └── /editar
│   └── /analise
│       └── /[id]
│
├── /aluno
│   └── /atividade/[id]
│
└── /api                          ← backend (não visível)
```

## 4. Hierarquia de Páginas

### Nível 0 - Home (`/`)
- Página de login da professora.
- Alunos não acessam pela home; usam link direto `/aluno`.

### Nível 1 - Área da Professora (`/professor`)
- Painel central com cards de acesso rápido.
- Acesso: professor(a) autenticada.

### Nível 2 - Módulos da Professora
- `/professor/classes` - gerenciamento de classes/anos.
- `/professor/atividades` - listagem de atividades.
- `/professor/analise` - seleção de atividade para análise.

### Nível 3 - Ações Detalhadas
- `/professor/classes/nova`
- `/professor/classes/[id]/editar`
- `/professor/atividades/nova`
- `/professor/atividades/[id]/editar`
- `/professor/analise/[id]` - respostas da atividade.

### Nível 1 - Área do Aluno (`/aluno`)
- Seleção de ano/classe.
- Lista de atividades disponíveis.

### Nível 2 - Atividade do Aluno (`/atividade/[id]`)
- Execução da atividade.
- Confirmação de envio.

## 5. Navegação por Público

### Professora (autenticada)
```
[Logo]  Classes | Atividades | Análise | Sair
```

### Aluno (público)
```
[Logo]  Escolher ano
```
- Navegação mínima, foco total na atividade.

## 6. Fluxos de Tarefas

### Fluxo 1 - Professora cria uma atividade
1. Faz login em `/`.
2. Clica em "Criar atividade" no painel.
3. Preenche título e descrição.
4. Seleciona os anos/classes de distribuição.
5. Configura as perguntas, podendo misturar quiz, formulário, cruzadinha e caça-palavra na mesma atividade.
6. Salva e recebe confirmação.

### Fluxo 2 - Aluno responde uma atividade
1. Acessa `/aluno`.
2. Seleciona o ano/classe.
3. Escolhe uma atividade na lista.
4. Responde as perguntas.
5. Envia e vê confirmação.

### Fluxo 3 - Professora analisa respostas
1. Acessa `/professor/analise`.
2. Seleciona uma atividade.
3. Visualiza lista de alunos que responderam.
4. Expande cada resposta para ver detalhes.

## 7. Entidades e Atributos Visíveis

### Classe/Ano
- Nome (ex: "6º Ano A")
- Ano numérico (1 a 9)

### Atividade
- Título
- Descrição
- Perguntas com tipos mistos (quiz, formulário, cruzadinha, caça-palavra, etc.)
- Anos/classes de distribuição
- Data de criação
- Status (ativo/inativo - futuro)

### Resposta
- Atividade respondida
- Data e hora de envio
- Conteúdo das respostas

## 8. Nomenclatura e Labels

| Conceito | Label no frontend |
|----------|-------------------|
| Classes/Anos | "Turmas" ou "Anos" |
| Atividades | "Atividades" |
| Quiz | "Quiz" |
| Formulário | "Formulário" |
| Cruzadinha | "Cruzadinha" |
| Caça-palavra | "Caça-palavra" |
| Memória | "Jogo da Memória" |
| Análise | "Ver respostas" |
| Responder | "Enviar resposta" |
| Distribuir para | "Disponível para" |

## 9. Permissões por Role

| Página | Professora | Aluno |
|--------|------------|-------|
| `/` | acesso | redireciona para `/aluno` |
| `/professor` | acesso | bloqueado |
| `/professor/classes` | acesso | bloqueado |
| `/professor/atividades` | acesso | bloqueado |
| `/professor/analise` | acesso | bloqueado |
| `/aluno` | acesso | acesso |
| `/atividade/[id]` | acesso | acesso |

## 10. Estados de Interface

### Tela vazia
- Quando não há classes cadastradas: "Nenhuma turma cadastrada. Crie a primeira turma."
- Quando não há atividades: "Nenhuma atividade criada."
- Quando não há respostas: "Nenhum aluno respondeu esta atividade ainda."

### Loading
- Spinner simples em ações assíncronas.
- Skeleton screens opcionais para listas.

### Erro
- Mensagens claras e ação de retry.
- Exemplo: "Não foi possível carregar as atividades. Tente novamente."

## 11. Considerações de UX

- Interface simples e com botões grandes para uso em sala de aula.
- Cores distintas para professor (área restrita) e aluno (área pública).
- Evitar jargão técnico; usar termos familiares a professores.
- Feedback imediato após salvar, excluir ou enviar.
- Responsivo para uso em tablets, computadores e projetores.
