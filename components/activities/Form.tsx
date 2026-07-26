"use client";

import type { QuestionViewProps } from "@/components/activities/types";
import { Input, Textarea } from "@/components/ui/Field";
import type { TextQuestion } from "@/lib/types";

/** Formulário de texto livre: resposta curta ou longa. */
export function Form({ question, index, value, onChange }: QuestionViewProps<TextQuestion>) {
  const id = `answer-${index}`;

  if (question.type === "textarea") {
    return (
      <Textarea
        id={id}
        value={value}
        placeholder="Escreva sua resposta"
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <Input
      id={id}
      value={value}
      placeholder="Escreva sua resposta"
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
