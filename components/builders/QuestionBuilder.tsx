"use client";

import { ImagePicker } from "@/components/builders/ImagePicker";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { IconPlus, IconTrash, QUESTION_TYPE_ICONS } from "@/components/ui/Icons";
import {
  AVAILABLE_QUESTION_TYPES,
  FUTURE_QUESTION_TYPES,
  QUESTION_TYPE_DESCRIPTIONS,
  QUESTION_TYPE_LABELS,
} from "@/lib/labels";
import type {
  DecorationImage,
  ImageQuizQuestion,
  PuzzleQuestion,
  PuzzleWord,
  Question,
  QuestionType,
  QuizQuestion,
} from "@/lib/types";

export type QuestionValidation = {
  label?: string;
  details?: string;
};

const LETTERS = "ABCD";

export function validateQuestion(question: Question): QuestionValidation {
  if (!question.label.trim()) return { label: "Informe o enunciado da pergunta." };

  if (question.type === "quiz") {
    const options = question.options.filter((option) => option.trim());
    if (options.length < 2) {
      return { details: "Adicione pelo menos duas alternativas." };
    }
    if (!question.correctAnswer?.trim() || !options.includes(question.correctAnswer.trim())) {
      return { details: "Marque uma alternativa correta." };
    }
  }

  if (question.type === "image-quiz") {
    const options = question.options.filter((option) => option !== null);
    if (options.length < 2) {
      return { details: "Escolha pelo menos duas imagens." };
    }
    if (!question.correctAnswer || !options.some((option) => option.id === question.correctAnswer)) {
      return { details: "Marque uma imagem como resposta correta." };
    }
  }

  if (question.type === "crossword" || question.type === "wordsearch") {
    const words = question.words.filter((item) => item.word.trim().length >= 2);
    if (words.length < 2) {
      return { details: "Adicione pelo menos duas palavras com 2 letras ou mais." };
    }
  }

  return {};
}

/** Pergunta em branco de cada tipo, preservando o enunciado já digitado. */
export function emptyQuestion(
  type: QuestionType,
  label = "",
  decoration?: DecorationImage,
): Question {
  const base = { label, ...(decoration ? { decoration } : {}) };
  switch (type) {
    case "quiz":
      return { ...base, type, options: ["", ""], correctAnswer: null };
    case "image-quiz":
      return { ...base, type, options: [null, null], correctAnswer: null };
    case "crossword":
    case "wordsearch":
      return { ...base, type, words: [{ word: "" }] };
    default:
      return { ...base, type: type === "textarea" ? "textarea" : "text" };
  }
}

export function QuestionBuilder({
  questions,
  onChange,
  validation,
}: {
  questions: Question[];
  onChange: (questions: Question[]) => void;
  validation?: QuestionValidation[];
}) {
  function replace(index: number, question: Question) {
    onChange(questions.map((item, i) => (i === index ? question : item)));
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((question, index) => {
        const Icon = QUESTION_TYPE_ICONS[question.type];
        const questionValidation = validation?.[index];
        return (
          <Card
            key={index}
            id={`question-${index}`}
            className="flex scroll-mt-6 flex-col gap-4 border-2 border-primary p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2.5 text-lg font-extrabold text-gray-900">
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-lg border-2 border-gray-900 bg-primary-light text-primary-dark"
                >
                  <Icon size={20} />
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

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Enunciado"
                htmlFor={`question-label-${index}`}
                required
                error={questionValidation?.label}
              >
                <Input
                  id={`question-label-${index}`}
                  value={question.label}
                  placeholder="Qual programa serve para escrever textos?"
                  aria-invalid={Boolean(questionValidation?.label)}
                  onChange={(e) => replace(index, { ...question, label: e.target.value })}
                />
              </Field>

              <Field
                label="Tipo da pergunta"
                htmlFor={`question-type-${index}`}
                hint={QUESTION_TYPE_DESCRIPTIONS[question.type]}
                hintPosition="below"
              >
                <Select
                  id={`question-type-${index}`}
                  value={question.type}
                  onChange={(e) =>
                    replace(
                      index,
                      emptyQuestion(
                        e.target.value as QuestionType,
                        question.label,
                        question.decoration,
                      ),
                    )
                  }
                >
                  {AVAILABLE_QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {QUESTION_TYPE_LABELS[type]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            {question.type === "quiz" && (
              <QuizOptions
                index={index}
                question={question}
                error={questionValidation?.details}
                onChange={(next) => replace(index, next)}
              />
            )}

            {(question.type === "crossword" || question.type === "wordsearch") && (
              <PuzzleWords
                index={index}
                question={question}
                error={questionValidation?.details}
                onChange={(next) => replace(index, next)}
              />
            )}

            {question.type === "image-quiz" && (
              <ImageQuizOptions
                index={index}
                question={question}
                error={questionValidation?.details}
                onChange={(next) => replace(index, next)}
              />
            )}

            {question.type !== "image-quiz" && (
              <ImagePicker
                questionIndex={index}
                value={question.decoration}
                onChange={(decoration) =>
                  replace(index, {
                    ...question,
                    ...(decoration ? { decoration } : {}),
                    ...(!decoration && question.decoration ? { decoration: undefined } : {}),
                  })
                }
              />
            )}
          </Card>
        );
      })}

      <button
        type="button"
        onClick={() => {
          const nextIndex = questions.length;
          onChange([...questions, emptyQuestion("quiz")]);
          requestAnimationFrame(() =>
            document.getElementById(`question-${nextIndex}`)?.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
              block: "start",
            }),
          );
        }}
        className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-4 border-dashed border-primary bg-white px-5 py-3 text-base font-extrabold uppercase tracking-wide text-primary transition-all duration-150 hover:border-primary-dark hover:bg-primary-light/30"
      >
        <IconPlus size={20} />
        Adicionar pergunta
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Em breve:</span>
        {FUTURE_QUESTION_TYPES.map((type) => (
          <Badge key={type}>{QUESTION_TYPE_LABELS[type]}</Badge>
        ))}
      </div>
    </div>
  );
}

function QuizOptions({
  index,
  question,
  error,
  onChange,
}: {
  index: number;
  question: QuizQuestion;
  error?: string;
  onChange: (question: QuizQuestion) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
        Alternativas
      </legend>
      <p className="text-sm font-semibold text-gray-600">
        Marque o círculo da alternativa correta.
      </p>

      {question.options.map((option, optionIndex) => {
        const isCorrect = !!option && question.correctAnswer === option;
        return (
          <div
            key={optionIndex}
            className={`flex items-center gap-3 rounded-lg border-2 px-3 py-2 transition-colors duration-150 ${
              isCorrect
                ? "border-student bg-student-light/40"
                : "border-transparent hover:border-gray-200"
            }`}
          >
            <input
              type="radio"
              name={`correct-${index}`}
              aria-label={`Alternativa correta ${optionIndex + 1}`}
              className="size-5 shrink-0 accent-student"
              checked={isCorrect}
              disabled={!option}
              onChange={() => onChange({ ...question, correctAnswer: option })}
            />
            <Input
              value={option}
              placeholder={`Alternativa ${optionIndex + 1}`}
              onChange={(e) => {
                const options = question.options.map((item, i) =>
                  i === optionIndex ? e.target.value : item,
                );
                onChange({
                  ...question,
                  options,
                  correctAnswer:
                    question.correctAnswer === option
                      ? e.target.value
                      : question.correctAnswer,
                });
              }}
            />
            {question.options.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Remover alternativa ${optionIndex + 1}`}
                onClick={() =>
                  onChange({
                    ...question,
                    options: question.options.filter((_, i) => i !== optionIndex),
                    correctAnswer:
                      question.correctAnswer === option ? null : question.correctAnswer,
                  })
                }
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
        onClick={() => onChange({ ...question, options: [...question.options, ""] })}
      >
        <IconPlus size={16} />
        Adicionar alternativa
      </Button>
      {error && <p role="alert" className="text-sm font-bold text-error">{error}</p>}
    </fieldset>
  );
}

function ImageQuizOptions({
  index,
  question,
  error,
  onChange,
}: {
  index: number;
  question: ImageQuizQuestion;
  error?: string;
  onChange: (question: ImageQuizQuestion) => void;
}) {
  function updateOption(optionIndex: number, image?: DecorationImage) {
    const previous = question.options[optionIndex];
    const options = question.options.map((option, currentIndex) =>
      currentIndex === optionIndex ? (image ?? null) : option,
    );
    onChange({
      ...question,
      options,
      correctAnswer:
        previous?.id === question.correctAnswer ? (image?.id ?? null) : question.correctAnswer,
    });
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
        Alternativas em imagens
      </legend>
      <p className="text-sm font-semibold text-gray-600">
        Escolha de duas a quatro imagens e marque a resposta correta.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          const isCorrect = !!option && question.correctAnswer === option.id;
          return (
            <div
              key={option?.id ?? `empty-${optionIndex}`}
              id={`image-option-${index}-${optionIndex}`}
              className={`flex min-w-0 flex-col gap-3 rounded-xl border-2 p-3 ${
                isCorrect ? "border-primary bg-primary-light/30" : "border-gray-200 bg-white"
              }`}
            >
              <ImagePicker
                questionIndex={index}
                pickerKey={`option-${optionIndex}`}
                heading={`Alternativa ${LETTERS[optionIndex]}`}
                description="Busque e selecione a imagem desta alternativa."
                value={option ?? undefined}
                onChange={(image) => updateOption(optionIndex, image)}
              />
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-900 bg-white px-3 py-2 text-sm font-extrabold text-gray-900">
                <input
                  type="radio"
                  name={`correct-image-${index}`}
                  checked={isCorrect}
                  disabled={!option}
                  onChange={() => option && onChange({ ...question, correctAnswer: option.id })}
                  className="size-5 accent-primary"
                />
                Resposta correta
              </label>
              {question.options.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="self-start"
                  onClick={() =>
                    onChange({
                      ...question,
                      options: question.options.filter((_, currentIndex) => currentIndex !== optionIndex),
                      correctAnswer: isCorrect ? null : question.correctAnswer,
                    })
                  }
                >
                  <IconTrash size={16} />
                  Remover alternativa
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {question.options.length < 4 && (
        <Button
          variant="secondary"
          size="sm"
          className="self-start"
          onClick={() => onChange({ ...question, options: [...question.options, null] })}
        >
          <IconPlus size={16} />
          Adicionar imagem
        </Button>
      )}
      {error && <p role="alert" className="text-sm font-bold text-error">{error}</p>}
    </fieldset>
  );
}

function PuzzleWords({
  index,
  question,
  error,
  onChange,
}: {
  index: number;
  question: PuzzleQuestion;
  error?: string;
  onChange: (question: PuzzleQuestion) => void;
}) {
  function updateWord(wordIndex: number, patch: Partial<PuzzleWord>) {
    onChange({
      ...question,
      words: question.words.map((item, i) =>
        i === wordIndex ? { ...item, ...patch } : item,
      ),
    });
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
        Palavras
      </legend>
      <p className="text-sm font-semibold text-gray-600">
        {question.type === "crossword"
          ? "As palavras são cruzadas automaticamente. A dica é opcional."
          : "As palavras ficam escondidas na grade. A dica é opcional."}
      </p>

      {question.words.map((item, wordIndex) => (
        <div key={wordIndex} className="flex flex-wrap items-end gap-3">
          <div className="min-w-40 flex-1">
            <Field label="Palavra" htmlFor={`word-${index}-${wordIndex}`} required>
              <Input
                id={`word-${index}-${wordIndex}`}
                value={item.word}
                placeholder="MOUSE"
                onChange={(e) => updateWord(wordIndex, { word: e.target.value })}
              />
            </Field>
          </div>
          <div className="min-w-48 flex-[2]">
            <Field label="Dica (opcional)" htmlFor={`clue-${index}-${wordIndex}`}>
              <Input
                id={`clue-${index}-${wordIndex}`}
                value={item.clue ?? ""}
                placeholder="Periférico usado para apontar"
                onChange={(e) => updateWord(wordIndex, { clue: e.target.value })}
              />
            </Field>
          </div>
          {question.words.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Remover palavra ${wordIndex + 1}`}
              onClick={() =>
                onChange({
                  ...question,
                  words: question.words.filter((_, i) => i !== wordIndex),
                })
              }
            >
              <IconTrash size={16} />
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="secondary"
        size="sm"
        className="self-start"
        onClick={() => onChange({ ...question, words: [...question.words, { word: "" }] })}
      >
        <IconPlus size={16} />
        Adicionar palavra
      </Button>

      {error && <p role="alert" className="text-sm font-bold text-error">{error}</p>}

      {question.type === "wordsearch" && (
        <div className="max-w-40">
          <Field
            label="Tamanho da grade"
            htmlFor={`grid-size-${index}`}
            hint="Entre 5 e 20 colunas."
          >
            <Input
              id={`grid-size-${index}`}
              type="number"
              min={5}
              max={20}
              value={question.gridSize ?? 10}
              onChange={(e) =>
                onChange({ ...question, gridSize: Number(e.target.value) || 10 })
              }
            />
          </Field>
        </div>
      )}
    </fieldset>
  );
}
