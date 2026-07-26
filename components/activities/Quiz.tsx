"use client";

import { useState } from "react";
import type { ActivityPlayerProps } from "@/components/activities/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Feedback";

export function Quiz({ activity, submitting, onSubmit }: ActivityPlayerProps) {
  const questions = activity.config?.questions ?? [];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const missing = questions.findIndex((_, index) => !answers[index]);
    if (missing >= 0) {
      setError(`Responda a pergunta ${missing + 1} antes de enviar.`);
      return;
    }

    setError(null);
    onSubmit(
      questions.map((question, index) => ({
        question: question.label,
        answer: answers[index],
      })),
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {error && <Alert tone="error">{error}</Alert>}

      {questions.map((question, index) => (
        <Card key={index} className="flex flex-col gap-4 p-5">
          <fieldset className="flex flex-col gap-3">
            <legend className="text-lg font-semibold text-gray-900">
              {index + 1}. {question.label}
            </legend>

            {question.options.map((option) => {
              const checked = answers[index] === option;
              return (
                <label
                  key={option}
                  className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-base transition-colors duration-200 ${
                    checked
                      ? "border-student bg-student-light text-gray-900"
                      : "border-gray-300 bg-white hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    className="size-5 accent-student"
                    checked={checked}
                    onChange={() => setAnswers({ ...answers, [index]: option })}
                  />
                  {option}
                </label>
              );
            })}
          </fieldset>
        </Card>
      ))}

      <Button type="submit" variant="student" size="lg" disabled={submitting}>
        {submitting ? "Enviando..." : "Enviar resposta"}
      </Button>
    </form>
  );
}
