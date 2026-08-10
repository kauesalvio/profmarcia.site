"use client";

import Image from "next/image";
import { useState } from "react";
import { ComingSoon } from "@/components/activities/ComingSoon";
import { Crossword } from "@/components/activities/Crossword";
import { Form } from "@/components/activities/Form";
import { ImageQuiz } from "@/components/activities/ImageQuiz";
import { Quiz } from "@/components/activities/Quiz";
import { WordSearch } from "@/components/activities/WordSearch";
import type { QuestionViewProps } from "@/components/activities/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Feedback";
import { openverseThumbnailUrl } from "@/lib/images";
import type { Activity, Answer, DecorationImage, Question } from "@/lib/types";

/** Renderiza a pergunta conforme o tipo escolhido pela professora. */
function QuestionView(props: QuestionViewProps) {
  const { question } = props;
  switch (question.type) {
    case "quiz":
      return <Quiz {...props} question={question} />;
    case "image-quiz":
      return <ImageQuiz {...props} question={question} />;
    case "crossword":
      return <Crossword {...props} question={question} />;
    case "wordsearch":
      return <WordSearch {...props} question={question} />;
    case "memory":
      return <ComingSoon type={question.type} />;
    default:
      return <Form {...props} question={question} />;
  }
}

/** Perguntas em desenvolvimento ou mal configuradas não geram resposta. */
function isAnswerable(question: Question) {
  if (question.type === "memory") return false;
  if (question.type === "quiz") return question.options.length > 0;
  if (question.type === "image-quiz")
    return question.options.filter((option) => option !== null).length >= 2;
  if (question.type === "crossword" || question.type === "wordsearch")
    return question.words.length > 0;
  return true;
}

/**
 * Cruzadinha e caça-palavra são enviados mesmo incompletos: travar o envio por
 * causa de um puzzle deixaria o aluno preso com o resto da atividade pronta.
 */
function isRequired(question: Question) {
  if (!isAnswerable(question)) return false;
  return question.type !== "crossword" && question.type !== "wordsearch";
}

export function ActivityPlayer({
  activity,
  submitting,
  onSubmit,
}: {
  activity: Activity;
  submitting: boolean;
  onSubmit: (answers: Answer[]) => void;
}) {
  const questions = activity.config?.questions ?? [];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  const answerable = questions.filter(isAnswerable);
  const answered = questions.filter(
    (question, index) => isAnswerable(question) && answers[index]?.trim(),
  ).length;
  const progress = answerable.length ? (answered / answerable.length) * 100 : 100;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const missing = questions.findIndex(
      (question, index) => isRequired(question) && !answers[index]?.trim(),
    );
    if (missing >= 0) {
      setError(`Responda a pergunta ${missing + 1} antes de enviar.`);
      return;
    }

    setError(null);
    onSubmit(
      questions
        .map((question, index) => ({
          question: question.label,
          answer: answers[index]?.trim() ?? "",
          answerable: isAnswerable(question),
        }))
        .filter((item) => item.answerable)
        .map(({ question, answer }) => ({ question, answer })),
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-black text-cream/70">
          <span>Seu progresso</span>
          <span className="text-sun">
            {answered} de {answerable.length}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={answerable.length}
          aria-label="Perguntas respondidas"
          className="h-4 overflow-hidden rounded-full border-2 border-gray-900 bg-gray-100"
        >
          <div
            className="h-full bg-student transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {questions.map((question, index) => {
        const value = answers[index] ?? "";
        const done = value.trim().length > 0;
        return (
          <Card key={index} className="overflow-hidden border-2 border-student p-4 sm:p-6">
            <div
              className={`grid min-w-0 gap-5 ${
                question.decoration ? "lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-start" : ""
              }`}
            >
              <div
                className={`flex min-w-0 flex-col gap-4 ${
                  question.decoration && index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <h2 className="flex items-start gap-3 text-lg font-extrabold text-gray-900">
                  <span
                    aria-hidden
                    className={`grid size-8 shrink-0 place-items-center rounded-lg border-2 border-gray-900 text-sm font-extrabold transition-colors duration-200 ${
                      done ? "bg-student text-white" : "bg-student-light text-student-dark"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 break-words">{question.label}</span>
                </h2>

                <QuestionView
                  question={question}
                  index={index}
                  value={value}
                  onChange={(next) => setAnswers({ ...answers, [index]: next })}
                />
              </div>

              {question.decoration && (
                <QuestionDecoration
                  image={question.decoration}
                  className={index % 2 === 1 ? "lg:order-1" : ""}
                />
              )}
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

function QuestionDecoration({
  image,
  className,
}: {
  image: DecorationImage;
  className?: string;
}) {
  return (
    <figure className={`min-w-0 ${className ?? ""}`}>
      <div className="relative aspect-[16/7] overflow-hidden rounded-xl border-2 border-gray-900 bg-gray-100 shadow-sm lg:aspect-[4/5]">
        <Image
          src={openverseThumbnailUrl(image.id)}
          alt=""
          fill
          sizes="(min-width: 1024px) 192px, 100vw"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-2 line-clamp-2 text-xs font-semibold text-gray-500">
        <a
          href={image.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-1 underline-offset-2 hover:text-student-dark"
        >
          {image.creator ? `${image.title}, por ${image.creator}` : image.title}
        </a>
        {` · ${image.license.toUpperCase()}`}
      </figcaption>
    </figure>
  );
}
