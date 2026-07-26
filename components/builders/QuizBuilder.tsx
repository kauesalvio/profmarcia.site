"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
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
            <h3 className="text-lg font-semibold text-gray-900">Pergunta {index + 1}</h3>
            {questions.length > 1 && (
              <Button
                variant="danger"
                onClick={() => onChange(questions.filter((_, i) => i !== index))}
              >
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

            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  aria-label={`Alternativa correta ${optionIndex + 1}`}
                  className="size-4 accent-primary"
                  checked={!!option && question.correctAnswer === option}
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
                    Remover
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="secondary"
              className="self-start"
              onClick={() => update(index, { options: [...question.options, ""] })}
            >
              Adicionar alternativa
            </Button>
          </fieldset>
        </Card>
      ))}

      <Button
        variant="secondary"
        className="self-start"
        onClick={() => onChange([...questions, emptyQuizQuestion()])}
      >
        Adicionar pergunta
      </Button>
    </div>
  );
}
