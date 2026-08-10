"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  QuestionBuilder,
  emptyQuestion,
  validateQuestion,
} from "@/components/builders/QuestionBuilder";
import { YearClassSelector } from "@/components/builders/YearClassSelector";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { IconCheck } from "@/components/ui/Icons";
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
  const [kahootUrl, setKahootUrl] = useState(
    typeof activity?.config?.settings?.kahootUrl === "string"
      ? activity.config.settings.kahootUrl
      : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  function isValidKahootUrl(value: string) {
    if (!value) return true;
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        (url.hostname === "kahoot.it" ||
          url.hostname.endsWith(".kahoot.it") ||
          url.hostname === "kahoot.com" ||
          url.hostname.endsWith(".kahoot.com"))
      );
    } catch {
      return false;
    }
  }

  function validate() {
    if (!title.trim()) return "Informe o título da atividade.";
    if (classIds.length === 0) return "Selecione ao menos um ano/turma.";
    if (questions.length === 0) return "Adicione ao menos uma pergunta.";
    const firstQuestionError = questions.findIndex((question) => {
      const validation = validateQuestion(question);
      return validation.label || validation.details;
    });
    if (firstQuestionError >= 0) {
      const validation = validateQuestion(questions[firstQuestionError]);
      return `Revise a pergunta ${firstQuestionError + 1}: ${validation.label ?? validation.details}`;
    }

    if (!isValidKahootUrl(kahootUrl.trim()))
      return "Cole um link válido do Kahoot, começando com https://.";

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
      case "image-quiz":
        return { ...question, label, options: question.options.filter((option) => option !== null) };
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

  function validateStep(currentStep = step) {
    if (currentStep === 1 && !title.trim()) return "Informe o título da atividade.";
    if (currentStep === 2 && classIds.length === 0)
      return "Selecione ao menos um ano/turma para continuar.";
    if (currentStep === 3) {
      if (questions.length === 0) return "Adicione ao menos uma pergunta.";
      if (questions.some((question) => !question.label.trim()))
        return "Preencha o enunciado de todas as perguntas para continuar.";
    }
    if (currentStep === 4 && !isValidKahootUrl(kahootUrl.trim()))
      return "Cole um link válido do Kahoot, começando com https://.";
    return null;
  }

  function goToStep(nextStep: number) {
    setStep(nextStep);
    requestAnimationFrame(() =>
      document.getElementById(`activity-step-${nextStep}`)?.scrollIntoView({ block: "start" }),
    );
  }

  function goToNext(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      setShowValidation(true);
      return;
    }
    setError(null);
    setShowValidation(false);
    goToStep(Math.min(step + 1, 4));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (step !== 4) {
      setError("Preencha todas as etapas antes de salvar a atividade.");
      return;
    }
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setShowValidation(true);
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
          settings: {
            ...(activity?.config?.settings ?? {}),
            kahootUrl: kahootUrl.trim() || undefined,
          },
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

      <nav aria-label="Progresso da atividade">
        <ol className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((s) => (
            <li
              key={s}
              aria-current={s === step ? "step" : undefined}
              className={`flex min-h-11 min-w-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm uppercase tracking-wide transition-colors duration-150 ${
                s === step
                  ? "bg-amarelo font-black text-marinho adesivo-sm"
                  : s < step
                    ? "bg-lima font-bold text-marinho adesivo-sm"
                    : "border-2 border-creme/30 font-bold text-creme/70"
              }`}
            >
              <span
                aria-hidden
                className="font-black"
              >
                {s < step ? <IconCheck size={16} strokeWidth={3} /> : s}
              </span>
              <span>
                {s === 1
                  ? "Informações"
                  : s === 2
                    ? "Distribuição"
                    : s === 3
                      ? "Perguntas"
                      : "Finalização"}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,1fr)] lg:items-start">
        <div className="min-w-0">
      {step === 1 && (
        <section id="activity-step-1" className="animate-rise scroll-mt-6 flex flex-col gap-3">
          <StepHeading step={1} title="Informações básicas" />
          <p className="text-sm font-bold text-cream/70">
            Comece com um título claro e uma breve explicação do que o aluno deve
            fazer nesta atividade.
          </p>
          <Card className="flex flex-col gap-5 p-5 sm:p-6">
            <Field
              label="Título"
              htmlFor="title"
              required
              error={showValidation && step === 1 && !title.trim() ? "Informe o título da atividade." : undefined}
            >
              <Input
                id="title"
                value={title}
                placeholder="Atividade de Word"
                aria-invalid={Boolean(showValidation && step === 1 && !title.trim())}
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
      )}

      {step === 2 && (
        <section id="activity-step-2" className="animate-rise scroll-mt-6 flex flex-col gap-3">
          <StepHeading step={2} title="Distribuição" />
          <p className="text-sm font-bold text-cream/70">
            Escolha quais turmas terão acesso à atividade. Você pode selecionar
            várias ao mesmo tempo.
          </p>
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
      )}

      {step === 3 && (
        <section id="activity-step-3" className="animate-rise scroll-mt-6 flex flex-col gap-3">
          <StepHeading step={3} title="Perguntas" />
          <p className="text-sm font-bold text-cream/70">
            Monte as perguntas da atividade. Você pode misturar quiz, resposta
            curta, resposta longa, cruzadinha e caça-palavra na mesma atividade.
          </p>
          <QuestionBuilder
            questions={questions}
            onChange={setQuestions}
            validation={showValidation ? questions.map(validateQuestion) : undefined}
          />
        </section>
      )}

      {step === 4 && (
        <section id="activity-step-4" className="animate-rise scroll-mt-6 flex flex-col gap-3">
          <StepHeading step={4} title="Finalização" />
          <p className="text-sm font-bold text-cream/70">
            Se quiser terminar com uma dinâmica no Kahoot, cole o link abaixo.
            O aluno verá o endereço depois de enviar a atividade.
          </p>
          <Card className="flex flex-col gap-5 p-5 sm:p-6">
            <Field
              label="Link do Kahoot (opcional)"
              htmlFor="kahoot-url"
              hint="Aceitamos links oficiais de kahoot.it e kahoot.com."
              error={
                showValidation && step === 4 && kahootUrl.trim() && !isValidKahootUrl(kahootUrl.trim())
                  ? "Cole um link válido do Kahoot, começando com https://."
                  : undefined
              }
            >
              <Input
                id="kahoot-url"
                type="url"
                inputMode="url"
                value={kahootUrl}
                placeholder="https://kahoot.it/challenge/..."
                aria-invalid={Boolean(
                  showValidation && step === 4 && kahootUrl.trim() && !isValidKahootUrl(kahootUrl.trim()),
                )}
                onChange={(event) => setKahootUrl(event.target.value)}
              />
            </Field>
            {kahootUrl.trim() && isValidKahootUrl(kahootUrl.trim()) && (
              <div className="rounded-xl border-2 border-primary bg-primary-light/40 p-4">
                <p className="text-sm font-extrabold uppercase tracking-wide text-primary-dark">
                  Prévia para o aluno
                </p>
                <p className="mt-2 break-all text-base font-bold text-gray-900 underline">
                  {kahootUrl.trim()}
                </p>
              </div>
            )}
          </Card>
        </section>
      )}

        </div>
        <aside className="min-w-0 space-y-5 lg:translate-y-4">
          <div className="rotate-1 rounded-3xl bg-marinho-2 p-5 adesivo">
            <h2 className="titulo-caixa text-xl text-creme">Prévia</h2>
            <div className="mt-4 rounded-2xl bg-creme p-4 text-marinho">
              <span className="inline-block rounded-lg bg-eletrico px-2 py-1 text-[11px] font-black uppercase tracking-widest text-creme">
                {questions.length} {questions.length === 1 ? "pergunta" : "perguntas"}
              </span>
              <p className="mt-2 text-lg font-extrabold leading-tight">
                {title.trim() || "Título da atividade"}
              </p>
              <p className="text-sm font-semibold text-marinho/70">
                {classIds.length} turma(s) selecionada(s)
              </p>
            </div>
          </div>
          <div className="rounded-3xl border-2 border-creme/25 p-5">
            <h2 className="titulo-caixa text-lg text-creme">Etapas</h2>
            <ol className="mt-3 space-y-2 text-sm text-creme/70">
              {["Informações básicas", "Distribuição", "Perguntas", "Finalização"].map((label, index) => (
                <li key={label} className={index + 1 === step ? "font-extrabold text-amarelo" : ""}>
                  {index + 1}. {label}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-cream/20 pt-6">
        <div className="flex flex-wrap gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => goToStep(step - 1)}
            >
              Voltar
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" size="lg" onClick={goToNext}>
              Próxima etapa
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? "Salvando..." : "Salvar atividade"}
            </Button>
          )}
        </div>
        <ButtonLink className="text-cream hover:bg-cream/10 hover:text-cream" href="/professor/atividades" variant="ghost" size="lg">
          Cancelar
        </ButtonLink>
      </div>
    </form>
  );
}

function StepHeading({ step, title }: { step: number; title: string }) {
  return (
    <h2 className="flex items-center gap-3 titulo-caixa text-2xl text-creme">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-amarelo text-sm font-black text-marinho adesivo-sm"
      >
        {step}
      </span>
      {title}
    </h2>
  );
}
