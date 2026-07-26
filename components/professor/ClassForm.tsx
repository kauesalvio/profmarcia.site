"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Feedback";
import { classesApi } from "@/lib/api";
import { SCHOOL_YEARS, yearLabel } from "@/lib/labels";
import type { SchoolClass } from "@/lib/types";

export function ClassForm({ schoolClass }: { schoolClass?: SchoolClass }) {
  const router = useRouter();
  const [name, setName] = useState(schoolClass?.name ?? "");
  const [year, setYear] = useState(String(schoolClass?.year ?? 1));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Informe o nome da turma.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const payload = { name: name.trim(), year: Number(year) };
      if (schoolClass) await classesApi.update(schoolClass._id, payload);
      else await classesApi.create(payload);
      router.push("/professor/classes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a turma.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-lg p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {error && <Alert tone="error">{error}</Alert>}

        <Field
          label="Nome da turma"
          htmlFor="name"
          hint="Como a turma aparece para você e para os alunos."
          required
        >
          <Input
            id="name"
            value={name}
            placeholder="6º Ano A"
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Ano" htmlFor="year" required>
          <Select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
            {SCHOOL_YEARS.map((option) => (
              <option key={option} value={option}>
                {yearLabel(option)}
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar turma"}
          </Button>
          <ButtonLink href="/professor/classes" variant="secondary">
            Cancelar
          </ButtonLink>
        </div>
      </form>
    </Card>
  );
}
