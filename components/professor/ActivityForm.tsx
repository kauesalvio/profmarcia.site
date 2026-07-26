"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActivityTypeSelector } from "@/components/builders/ActivityTypeSelector";
import { FormBuilder, emptyFormQuestion } from "@/components/builders/FormBuilder";
import { QuizBuilder, emptyQuizQuestion } from "@/components/builders/QuizBuilder";
import { YearClassSelector } from "@/components/builders/YearClassSelector";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { activitiesApi, classesApi } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import type { Activity, ActivityType, Question } from "@/lib/types";

function initialQuestions(type: ActivityType, activity?: Activity): Question[] {
  if (activity?.type === type && activity.config?.questions?.length) {
    return activity.config.questions;
  }
  return [type === "quiz" ? emptyQuizQuestion() : emptyFormQuestion()];
}

export function ActivityForm({ activity }: { activity?: Activity }) {
  const router = useRouter();
  const classes = useResource(() => classesApi.list());

  const [title, setTitle] = useState(activity?.title ?? "");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [type, setType] = useState<ActivityType>(activity?.type ?? "quiz");
  const [classIds, setClassIds] = useState<string[]>(activity?.classIds ?? []);
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions(activity?.type ?? "quiz", activity),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleTypeChange(nextType: ActivityType) {
    setType(nextType);
    setQuestions(initialQuestions(nextType, activity));
  }

  function validate() {
    if (!title.trim()) return "Informe o título da atividade.";
    if (classIds.length === 0) return "Selecione ao menos um ano/turma.";
    if (questions.length === 0) return "Adicione ao menos uma pergunta.";
    if (questions.some((question) => !question.label.trim()))
      return "Todas as perguntas precisam de enunciado.";
    if (type === "quiz") {
      const invalid = questions.find(
        (question) =>
          question.options.filter((option) => option.trim()).length < 2 ||
          !question.correctAnswer?.trim(),
      );
      if (invalid)
        return "Cada pergunta do quiz precisa de duas alternativas e uma resposta correta.";
    }
    return null;
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
        type,
        classIds,
        config: {
          questions: questions.map((question) => ({
            ...question,
            label: question.label.trim(),
            options: question.options.map((option) => option.trim()).filter(Boolean),
          })),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {error && <Alert tone="error">{error}</Alert>}

      <Card className="flex flex-col gap-5 p-5">
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

      <Card className="p-5">
        <ActivityTypeSelector value={type} onChange={handleTypeChange} />
      </Card>

      <Card className="p-5">
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

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {type === "quiz" ? "Perguntas do quiz" : "Campos do formulário"}
        </h2>
        {type === "quiz" ? (
          <QuizBuilder questions={questions} onChange={setQuestions} />
        ) : (
          <FormBuilder questions={questions} onChange={setQuestions} />
        )}
      </section>

      <div className="flex flex-wrap gap-3">
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
