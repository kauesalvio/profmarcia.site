"use client";

import { useState } from "react";
import type { ActivityPlayerProps } from "@/components/activities/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Feedback";

const LETTERS = "ABCDEFGHIJ";

export function Quiz({ activity, submitting, onSubmit }: ActivityPlayerProps) {
  const questions = activity.config?.questions ?? [];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  const answered = questions.filter((_, index) => answers[index]).length;
  const progress = questions.length ? (answered / questions.length) * 100 : 0;

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
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-medium text-gray-500">
          <span>Seu progresso</span>
          <span className="font-bold text-student-dark">
            {answered} de {questions.length}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-label="Perguntas respondidas"
          className="h-2.5 overflow-hidden rounded-full bg-gray-200"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-student to-student-dark transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {questions.map((question, index) => (
        <Card key={index} className="flex flex-col gap-4 p-5 sm:p-6">
          <fieldset className="flex flex-col gap-3">
            <legend className="flex items-start gap-3 text-lg font-semibold text-gray-900">
              <span
                aria-hidden
                className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold transition-colors duration-200 ${
                  answers[index]
                    ? "bg-student text-white"
                    : "bg-student-light text-student-dark"
                }`}
              >
                {index + 1}
              </span>
              {question.label}
            </legend>

            {question.options.map((option, optionIndex) => {
              const checked = answers[index] === option;
              return (
                <label
                  key={option}
                  className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-base transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-student ${
                    checked
                      ? "border-student bg-student-light text-gray-900 shadow-sm"
                      : "border-gray-200 bg-white hover:border-student/40 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    className="sr-only"
                    checked={checked}
                    onChange={() => setAnswers({ ...answers, [index]: option })}
                  />
                  <span
                    aria-hidden
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-200 ${
                      checked
                        ? "bg-student text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {LETTERS[optionIndex] ?? optionIndex + 1}
                  </span>
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
