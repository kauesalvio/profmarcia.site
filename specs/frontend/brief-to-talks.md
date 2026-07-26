# Brief to Talks

Roteiro e material de conversa para apresentar o projeto do site de aulas de informática para professores, coordenadores e possíveis apoiadores.

## 1. Elevator Pitch

> "Um site simples e gratuito para professores de informática criarem atividades interativas — como quiz, formulários, cruzadinhas e caça-palavras — para alunos do 1º ao 9º ano, sem exigir login dos estudantes e com painel de análise das respostas."

## 2. Público da Conversa

| Perfil | Interesse principal |
|--------|---------------------|
| Professora de informática | Facilidade para criar e aplicar atividades |
| Coordenador pedagógico | Acompanhamento das aulas e engajamento dos alunos |
| Diretor/ Gestor escolar | Baixo custo e simplicidade de adoção |
| Alunos | Atividades divertidas e fáceis de acessar |
| Responsáveis | Visibilidade do que o aluno faz em aula |

## 3. Problema

- Aulas de informática muitas vezes carecem de ferramentas digitais simples e adaptadas.
- Plataformas prontas são genéricas, pagas ou exigem login dos alunos.
- A professora perde tempo organizando atividades em vários lugares.
- Dificuldade de acompanhar quem respondeu e o que respondeu.

## 4. Solução

Um site leve, moderno e de fácil uso:
- Login apenas para a professora.
- Alunos acessam pelo link, escolhem o ano e respondem.
- A professora cria atividades com título, descrição, perguntas mistas (quiz e formulário) e distribuição por ano.
- Painel de análise mostra, por atividade, as respostas enviadas.

## 5. Funcionalidades em uma Conversa

"Com esse site, a professora pode:"
1. Fazer login com e-mail e senha.
2. Cadastrar as turmas do 1º ao 9º ano.
3. Criar atividades com perguntas de quiz, formulário, cruzadinha e caça-palavra mistas.
4. Escolher para quais anos aquela atividade será disponibilizada.
5. Compartilhar o link com os alunos.
6. Ver, em uma tela simples, o que foi respondido.

"E os alunos:"
1. Acessam sem senha.
2. Escolhem o ano.
3. Veem as atividades disponíveis.
4. Respondem.

## 6. Tecnologia Resumida

- **Frontend:** Next.js com React — moderno, rápido e fácil de hospedar.
- **Backend:** API Routes do próprio Next.js — sem servidor separado.
- **Banco de dados:** MongoDB Atlas — gratuito e na nuvem.
- **Hospedagem:** Vercel — gratuita e com deploy automático.

## 7. Perguntas e Respostas

### "Os alunos precisam criar conta?"
Não. Eles acessam pelo link, escolhem o ano e respondem.

### "É seguro?"
Sim. Apenas a professora faz login. A senha é armazenada com criptografia. Os dados ficam no MongoDB Atlas, que é seguro e gratuito para projetos pequenos.

### "Tem custo?"
Na versão inicial, não. MongoDB Atlas e Vercel oferecem planos gratuitos que atendem o projeto.

### "Funciona no celular?"
Sim. O site é responsivo e funciona em computadores, tablets e celulares.

### "Posso criar vários tipos de atividades?"
Na primeira versão, as perguntas podem ser de quiz, formulário, cruzadinha e caça-palavra, podendo ser misturadas dentro da mesma atividade. Depois, podemos adicionar o jogo da memória.

### "A professora consegue ver as respostas?"
Sim. Há uma tela de análise por atividade com as respostas enviadas.

### "E se a professora quiser usar para outras matérias?"
O sistema é flexível. Basta adaptar o conteúdo das atividades. O foco inicial é informática, mas a estrutura serve para outras áreas.

## 8. Roteiro de Apresentação (5 minutos)

### 1 minuto - Contexto
"Muitas professoras de informática precisam de uma forma simples de aplicar atividades em sala. Ferramentas prontas exigem login dos alunos ou são pagas."

### 2 minutos - Demonstração
Mostrar:
- Login da professora.
- Criação rápida de uma atividade com perguntas mistas (quiz, formulário, cruzadinha, caça-palavra).
- Seleção do ano de distribuição.
- Visualização do link para os alunos.
- Tela do aluno respondendo.

### 1 minuto - Análise
Mostrar a tela de análise com as respostas enviadas.

### 1 minuto - Próximos passos
- Coletar feedback da professora.
- Ajustar conforme o uso real.
- Adicionar novos tipos de atividades no futuro.

## 9. Mensagens-chave

- **Simples:** sem complicação técnica para professora e aluno.
- **Acessível:** funciona em qualquer dispositivo com internet.
- **Gratuito:** sem custo inicial com hospedagem e banco na nuvem.
- **Escalável:** pode crescer com novos tipos de atividades no futuro.

## 10. Material de Apoio

- Link para a spec geral: `tech-spec.md`
- Link para arquitetura de informação: `information-architecture.md`
- Link para design tokens: `design-tokens.md`
- Link para frontend: `frontend.md`
- Link para backend: `backend.md`
- Link para MongoDB: `mongodb.md`
