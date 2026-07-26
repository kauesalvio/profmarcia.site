"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { IconPlus, IconTrash } from "@/components/ui/Icons";
import type { Question } from "@/lib/types";

export function emptyQuizQuestion(): Question {
  return { label: "", type: "single", options: ["", ""], correctAnswer: null };
}

export function QuizBuilder({
  questions,
  onChange,
}: {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}) {
  function update(index: number, patch: Partial<Question>) {
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function updateOption(index: number, optionIndex: number, value: string) {
    const question = questions[index];
    const options = question.options.map((option, i) => (i === optionIndex ? value : option));
    const correctAnswer =
      question.correctAnswer === question.options[optionIndex] ? value : question.correctAnswer;
    update(index, { options, correctAnswer });
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((question, index) => (
        <Card key={index} className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-lg bg-primary-light text-sm font-bold text-primary-dark"
              >
                {index + 1}
              </span>
              Pergunta {index + 1}
            </h3>
            {questions.length > 1 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onChange(questions.filter((_, i) => i !== index))}
              >
                <IconTrash size={16} />
                Remover
              </Button>
            )}
          </div>

          <Field label="Enunciado" htmlFor={`quiz-label-${index}`} required>
            <Input
              id={`quiz-label-${index}`}
              value={question.label}
              placeholder="Qual programa serve para escrever textos?"
              onChange={(e) => update(index, { label: e.target.value })}
            />
          </Field>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-gray-900">Alternativas</legend>
            <p className="text-sm text-gray-500">
              Marque o círculo da alternativa correta.
            </p>

            {question.options.map((option, optionIndex) => {
              const isCorrect = !!option && question.correctAnswer === option;
              return (
                <div
                  key={optionIndex}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-1.5 transition-colors duration-200 ${
                    isCorrect
                      ? "border-student/40 bg-student-light/40"
                      : "border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    aria-label={`Alternativa correta ${optionIndex + 1}`}
                    className="size-5 shrink-0 accent-student"
                    checked={isCorrect}
                    disabled={!option}
                    onChange={() => update(index, { correctAnswer: option })}
                  />
                  <Input
                    value={option}
                    placeholder={`Alternativa ${optionIndex + 1}`}
                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                  />
                  {question.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Remover alternativa ${optionIndex + 1}`}
                      onClick={() => {
                        const removed = question.options[optionIndex];
                        update(index, {
                          options: question.options.filter((_, i) => i !== optionIndex),
                          correctAnswer:
                            question.correctAnswer === removed ? null : question.correctAnswer,
                        });
                      }}
                    >
                      <IconTrash size={16} />
                    </Button>
                  )}
                </div>
              );
            })}

            <Button
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => update(index, { options: [...question.options, ""] })}
            >
              <IconPlus size={16} />
              Adicionar alternativa
            </Button>
          </fieldset>
        </Card>
      ))}

      <button
        type="button"
        onClick={() => onChange([...questions, emptyQuizQuestion()])}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white/60 px-5 py-3 text-base font-medium text-gray-500 transition-colors duration-200 hover:border-primary hover:bg-primary-light/30 hover:text-primary-dark"
      >
        <IconPlus size={18} />
        Adicionar pergunta
      </button>
    </div>
  );
}
