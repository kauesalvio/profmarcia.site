"use client";

import { useState } from "react";
import type { ActivityPlayerProps } from "@/components/activities/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Feedback";

export function Form({ activity, submitting, onSubmit }: ActivityPlayerProps) {
  const questions = activity.config?.questions ?? [];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const missing = questions.findIndex((_, index) => !answers[index]?.trim());
    if (missing >= 0) {
      setError(`Responda a pergunta ${missing + 1} antes de enviar.`);
      return;
    }

    setError(null);
    onSubmit(
      questions.map((question, index) => ({
        question: question.label,
        answer: answers[index].trim(),
      })),
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {error && <Alert tone="error">{error}</Alert>}

      {questions.map((question, index) => {
        const id = `answer-${index}`;
        const value = answers[index] ?? "";
        const filled = value.trim().length > 0;
        const onChange = (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => setAnswers({ ...answers, [index]: event.target.value });

        return (
          <Card key={index} className="flex gap-4 p-5 sm:p-6">
            <span
              aria-hidden
              className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold transition-colors duration-200 ${
                filled ? "bg-student text-white" : "bg-student-light text-student-dark"
              }`}
            >
              {index + 1}
            </span>
            <div className="flex-1">
              <Field label={question.label} htmlFor={id} required>
                {question.type === "textarea" ? (
                  <Textarea id={id} value={value} onChange={onChange} />
                ) : (
                  <Input id={id} value={value} onChange={onChange} />
                )}
              </Field>
            </div>
          </Card>
        );
      })}

      <Button type="submit" variant="student" size="lg" disabled={submitting}>
        {submitting ? "Enviando..." : "Enviar resposta"}
      </Button>
    </form>
  );
}
