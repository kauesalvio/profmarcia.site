# Design

<!-- impeccable:design-schema 1 -->

## Direction

**Cartazes de Informática** — uma interface ousada, lúdica e direta, inspirada nos cartazes e aberturas de Saul Bass: cores planas fortes, formas recortadas, sombras duras e tipografia em caixa alta. A professora navega por um sistema azul cobalto; o aluno, por um campo laranja queimado. Tudo é grande, claro e imediatamente reconhecível.

## Platform

web (Next.js 16 App Router, Tailwind CSS v4)

## Color

Professor: azul cobalto `#0047AB` sobre fundo quente.  
Aluno: laranja queimado `#E85D04` sobre fundo quente.  
Neutros: branco `#FFFFFF`, cinzas quentes `#F7F5F0` → `#1C1A16`.  
Feedback: verde escuro `#2D6A4F`, vermelho escuro `#9D0208`, amarelo/alerta `#D00000`, azul info `#0077B6`.

## Typography

Inter em todos os usos. Títulos: extrabold, uppercase, tracking ajustado. Corpo: semibold/bold, espaçamento amplo. Não há gradientes no texto.

## Materials

- Fundo quente com degradês radiais sutis por área.
- Cartões brancos com bordas escuras grossas (`border-2`/`border-4`) e sombra dura (`shadow-md`/`shadow-hard`).
- Ícones stroke grosso (2.5) em silhuetas claras.
- Botões com bordas, sombra e elevação no hover.

## Motion

Entrada suave `rise` e `pop` com easing exponencial. Transições de 150–200ms. Efeitos em botões e cards: elevação `-translate-y` e aumento de sombra no hover. `prefers-reduced-motion` respeitado.

## Components

- **Button**: borda-2, fundo sólido, texto em caixa alta nos tamanhos grandes, sombra dura, hover eleva.
- **Card/InteractiveCard**: borda-2 escura, fundo branco, sombra dura, hover eleva.
- **Badge**: pill com borda-2 e texto em caixa alta.
- **Field/Input**: label caixa alta, input com borda-2 escura, sombra sutil, hover eleva.
- **Header**: branco, borda inferior escura grossa, navegação em pills.
- **Alert**: borda-2, ícone em círculo escuro.

## Layout rules

- Container central `max-w-5xl` (professor) e `max-w-3xl` (aluno).
- Cards e botões nunca tocam sem gap; hierarquia por escala e peso, não por cinza.
- Áreas de toque mínimas de 44px/48px.
- Foco visível `outline-3` primário.

## Surface contracts

- **Login (`/`)**: fundo azul primário com formas geométricas; título caps; card branco com borda escura; link aluno como cartaz laranja.
- **Professor**: cabeçalho azul, cards com bordas coloridas, títulos em caps, ações grandes.
- **Aluno (`/aluno`)**: fundo laranja radial, seleção de ano em grid de cartões, atividades com borda laranja.
- **Atividade (`/atividade/[id]`)**: perguntas em cards laranja, progresso em barra com borda escura.

## What this design refuses

- Cartões iguais de ícone + título + texto como estrutura padrão.
- Gradientes decorativos, glass/blur sem função, bordas laterais grossas em alerts.
- Tipografia genérica sem peso, sem caps, sem hierarquia.
