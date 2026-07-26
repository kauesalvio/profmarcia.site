"use client";

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
  PuzzleQuestion,
  PuzzleWord,
  Question,
  QuestionType,
  QuizQuestion,
} from "@/lib/types";

/** Pergunta em branco de cada tipo, preservando o enunciado já digitado. */
export function emptyQuestion(type: QuestionType, label = ""): Question {
  switch (type) {
    case "quiz":
      return { label, type, options: ["", ""], correctAnswer: null };
    case "crossword":
    case "wordsearch":
      return { label, type, words: [{ word: "" }] };
    default:
      return { label, type: type === "textarea" ? "textarea" : "text" };
  }
}

export function QuestionBuilder({
  questions,
  onChange,
}: {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}) {
  function replace(index: number, question: Question) {
    onChange(questions.map((item, i) => (i === index ? question : item)));
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((question, index) => {
        const Icon = QUESTION_TYPE_ICONS[question.type];
        return (
          <Card key={index} className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-lg bg-primary-light text-primary-dark"
                >
                  <Icon size={18} />
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
              <Field label="Enunciado" htmlFor={`question-label-${index}`} required>
                <Input
                  id={`question-label-${index}`}
                  value={question.label}
                  placeholder="Qual programa serve para escrever textos?"
                  onChange={(e) => replace(index, { ...question, label: e.target.value })}
                />
              </Field>

              <Field
                label="Tipo da pergunta"
                htmlFor={`question-type-${index}`}
                hint={QUESTION_TYPE_DESCRIPTIONS[question.type]}
              >
                <Select
                  id={`question-type-${index}`}
                  value={question.type}
                  onChange={(e) =>
                    replace(
                      index,
                      emptyQuestion(e.target.value as QuestionType, question.label),
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
                onChange={(next) => replace(index, next)}
              />
            )}

            {(question.type === "crossword" || question.type === "wordsearch") && (
              <PuzzleWords
                index={index}
                question={question}
                onChange={(next) => replace(index, next)}
              />
            )}
          </Card>
        );
      })}

      <button
        type="button"
        onClick={() => onChange([...questions, emptyQuestion("quiz")])}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white/60 px-5 py-3 text-base font-medium text-gray-500 transition-colors duration-200 hover:border-primary hover:bg-primary-light/30 hover:text-primary-dark"
      >
        <IconPlus size={18} />
        Adicionar pergunta
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">Em breve:</span>
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
  onChange,
}: {
  index: number;
  question: QuizQuestion;
  onChange: (question: QuizQuestion) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-semibold text-gray-900">Alternativas</legend>
      <p className="text-sm text-gray-500">Marque o círculo da alternativa correta.</p>

      {question.options.map((option, optionIndex) => {
        const isCorrect = !!option && question.correctAnswer === option;
        return (
          <div
            key={optionIndex}
            className={`flex items-center gap-3 rounded-lg border px-3 py-1.5 transition-colors duration-200 ${
              isCorrect ? "border-student/40 bg-student-light/40" : "border-transparent"
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
    </fieldset>
  );
}

function PuzzleWords({
  index,
  question,
  onChange,
}: {
  index: number;
  question: PuzzleQuestion;
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
      <legend className="text-sm font-semibold text-gray-900">Palavras</legend>
      <p className="text-sm text-gray-500">
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
