"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuestionBuilder, emptyQuestion } from "@/components/builders/QuestionBuilder";
import { YearClassSelector } from "@/components/builders/YearClassSelector";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { activitiesApi, classesApi } from "@/lib/api";
import { normalizeWord } from "@/lib/puzzle";
import { useResource } from "@/lib/useResource";
import type { Activity, Question } from "@/lib/types";

export function ActivityForm({ activity }: { activity?: Activity }) {
  const router = useRouter();
  const classes = useResource(() => classesApi.list());

  const [title, setTitle] = useState(activity?.title ?? "");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [classIds, setClassIds] = useState<string[]>(activity?.classIds ?? []);
  const [questions, setQuestions] = useState<Question[]>(
    activity?.config?.questions?.length
      ? activity.config.questions
      : [emptyQuestion("quiz")],
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function validate() {
    if (!title.trim()) return "Informe o título da atividade.";
    if (classIds.length === 0) return "Selecione ao menos um ano/turma.";
    if (questions.length === 0) return "Adicione ao menos uma pergunta.";
    if (questions.some((question) => !question.label.trim()))
      return "Todas as perguntas precisam de enunciado.";

    for (const question of questions) {
      if (question.type === "quiz") {
        if (
          question.options.filter((option) => option.trim()).length < 2 ||
          !question.correctAnswer?.trim()
        ) {
          return "Cada pergunta de quiz precisa de duas alternativas e uma resposta correta.";
        }
      }
      if (question.type === "crossword" || question.type === "wordsearch") {
        const valid = question.words.filter((item) => normalizeWord(item.word).length >= 2);
        if (valid.length < 2)
          return "Cruzadinha e caça-palavra precisam de ao menos duas palavras com 2 letras ou mais.";
      }
    }
    return null;
  }

  /** Normaliza cada pergunta conforme o tipo antes de enviar para a API. */
  function serializeQuestion(question: Question): Question {
    const label = question.label.trim();
    switch (question.type) {
      case "quiz": {
        const options = question.options.map((option) => option.trim()).filter(Boolean);
        return { ...question, label, options };
      }
      case "crossword":
      case "wordsearch": {
        const words = question.words
          .map((item) => ({
            word: normalizeWord(item.word),
            ...(item.clue?.trim() ? { clue: item.clue.trim() } : {}),
          }))
          .filter((item) => item.word.length >= 2);
        return { ...question, label, words };
      }
      default:
        return { ...question, label };
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        classIds,
        config: {
          questions: questions.map(serializeQuestion),
          settings: activity?.config?.settings ?? {},
        },
      };

      if (activity) await activitiesApi.update(activity._id, payload);
      else await activitiesApi.create(payload);
      router.push("/professor/atividades");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a atividade.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      {error && <Alert tone="error">{error}</Alert>}

      <section className="flex flex-col gap-3">
        <StepHeading step={1} title="Informações básicas" />
        <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <Field label="Título" htmlFor="title" required>
          <Input
            id="title"
            value={title}
            placeholder="Atividade de Word"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field
          label="Descrição"
          htmlFor="description"
          hint="Explique para o aluno o que ele deve fazer."
        >
          <Textarea
            id="description"
            value={description}
            placeholder="Crie um documento com título e parágrafo."
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading step={2} title="Distribuição" />
        <Card className="p-5 sm:p-6">
          {classes.loading && <Spinner label="Carregando turmas..." />}
          {classes.error && !classes.loading && (
            <Alert
              tone="error"
              action={
                <Button variant="secondary" onClick={classes.reload}>
                  Tentar novamente
                </Button>
              }
            >
              Não foi possível carregar as turmas.
            </Alert>
          )}
          {!classes.loading && !classes.error && (
            <YearClassSelector
              classes={classes.data ?? []}
              selected={classIds}
              onChange={setClassIds}
            />
          )}
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading step={3} title="Perguntas" />
        <p className="-mt-1 text-sm text-gray-500">
          Você pode misturar quiz, formulário, cruzadinha e caça-palavra na mesma
          atividade.
        </p>
        <QuestionBuilder questions={questions} onChange={setQuestions} />
      </section>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Salvando..." : "Salvar atividade"}
        </Button>
        <ButtonLink href="/professor/atividades" variant="secondary" size="lg">
          Cancelar
        </ButtonLink>
      </div>
    </form>
  );
}

function StepHeading({ step, title }: { step: number; title: string }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white shadow-sm"
      >
        {step}
      </span>
      {title}
    </h2>
  );
}
