"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { IconPlus, IconTrash } from "@/components/ui/Icons";
import { QUESTION_TYPE_LABELS } from "@/lib/labels";
import type { Question, QuestionType } from "@/lib/types";

export function emptyFormQuestion(): Question {
  return { label: "", type: "text", options: [], correctAnswer: null };
}

const FORM_QUESTION_TYPES: QuestionType[] = ["text", "textarea"];

export function FormBuilder({
  questions,
  onChange,
}: {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}) {
  function update(index: number, patch: Partial<Question>) {
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
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
              Campo {index + 1}
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

          <Field label="Pergunta" htmlFor={`form-label-${index}`} required>
            <Input
              id={`form-label-${index}`}
              value={question.label}
              placeholder="Qual foi o tema escolhido?"
              onChange={(e) => update(index, { label: e.target.value })}
            />
          </Field>

          <Field label="Tipo de resposta" htmlFor={`form-type-${index}`}>
            <Select
              id={`form-type-${index}`}
              value={question.type}
              onChange={(e) => update(index, { type: e.target.value as QuestionType })}
            >
              {FORM_QUESTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {QUESTION_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>
          </Field>
        </Card>
      ))}

      <button
        type="button"
        onClick={() => onChange([...questions, emptyFormQuestion()])}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white/60 px-5 py-3 text-base font-medium text-gray-500 transition-colors duration-200 hover:border-primary hover:bg-primary-light/30 hover:text-primary-dark"
      >
        <IconPlus size={18} />
        Adicionar campo
      </button>
    </div>
  );
}
