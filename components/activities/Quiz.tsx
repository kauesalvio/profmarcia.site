"use client";

import type { QuestionViewProps } from "@/components/activities/types";
import { Alert } from "@/components/ui/Feedback";
import type { QuizQuestion } from "@/lib/types";

const LETTERS = "ABCDEFGHIJ";

/** Pergunta de quiz: alternativas com uma resposta correta. */
export function Quiz({ question, index, value, onChange }: QuestionViewProps<QuizQuestion>) {
  if (question.options.length === 0) {
    return <Alert tone="info">Esta pergunta ainda não tem alternativas cadastradas.</Alert>;
  }

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option, optionIndex) => {
        const checked = value === option;
        return (
          <label
            key={option}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-4 px-4 py-3 text-base font-semibold transition-all duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-student ${
              checked
                ? "border-student bg-student-light text-gray-900 shadow-sm"
                : "border-gray-200 bg-white hover:border-student/60 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={`question-${index}`}
              className="sr-only"
              checked={checked}
              onChange={() => onChange(option)}
            />
            <span
              aria-hidden
              className={`grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold transition-colors duration-150 ${
                checked
                  ? "border-gray-900 bg-student text-white"
                  : "border-gray-300 bg-gray-100 text-gray-500"
              }`}
            >
              {LETTERS[optionIndex] ?? optionIndex + 1}
            </span>
            {option}
          </label>
        );
      })}
    </div>
  );
}
