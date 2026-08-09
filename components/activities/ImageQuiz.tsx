"use client";

import Image from "next/image";
import type { QuestionViewProps } from "@/components/activities/types";
import { Alert } from "@/components/ui/Feedback";
import { openverseThumbnailUrl } from "@/lib/images";
import type { ImageQuizQuestion } from "@/lib/types";

const LETTERS = "ABCD";

export function ImageQuiz({
  question,
  index,
  value,
  onChange,
}: QuestionViewProps<ImageQuizQuestion>) {
  const options = question.options.filter((option) => option !== null);

  if (options.length < 2) {
    return <Alert tone="info">Esta pergunta ainda não tem imagens suficientes.</Alert>;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option, optionIndex) => {
        const checked = value === option.id;
        return (
          <label
            key={option.id}
            className={`group min-w-0 cursor-pointer overflow-hidden rounded-xl border-4 bg-white transition-all duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-student ${
              checked
                ? "border-student bg-student-light shadow-md"
                : "border-gray-200 hover:-translate-y-0.5 hover:border-student/60"
            }`}
          >
            <input
              type="radio"
              name={`question-${index}`}
              className="sr-only"
              checked={checked}
              onChange={() => onChange(option.id)}
            />
            <span className="relative block aspect-[4/3] bg-gray-100">
              <Image
                src={openverseThumbnailUrl(option.id)}
                alt={option.title}
                fill
                sizes="(min-width: 1024px) 360px, 45vw"
                className="object-cover"
              />
              <span
                aria-hidden
                className={`absolute left-2 top-2 grid size-9 place-items-center rounded-full border-2 border-gray-900 text-sm font-extrabold ${
                  checked ? "bg-student text-white" : "bg-white text-gray-900"
                }`}
              >
                {LETTERS[optionIndex]}
              </span>
            </span>
            <span className="block min-h-12 break-words px-3 py-2 text-sm font-extrabold text-gray-900 sm:text-base">
              {option.title}
            </span>
          </label>
        );
      })}
    </div>
  );
}
