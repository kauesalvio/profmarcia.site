"use client";

import { Badge } from "@/components/ui/Card";
import { ACTIVITY_TYPE_ICONS, IconCheck } from "@/components/ui/Icons";
import {
  ACTIVITY_TYPE_DESCRIPTIONS,
  ACTIVITY_TYPE_LABELS,
  AVAILABLE_ACTIVITY_TYPES,
  FUTURE_ACTIVITY_TYPES,
} from "@/lib/labels";
import type { ActivityType } from "@/lib/types";

export function ActivityTypeSelector({
  value,
  onChange,
}: {
  value: ActivityType;
  onChange: (type: ActivityType) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-gray-900">Tipo de atividade</legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {AVAILABLE_ACTIVITY_TYPES.map((type) => {
          const selected = value === type;
          const Icon = ACTIVITY_TYPE_ICONS[type];
          return (
            <label
              key={type}
              className={`relative flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                selected
                  ? "border-primary bg-primary-light/50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="activity-type"
                className="sr-only"
                checked={selected}
                onChange={() => onChange(type)}
              />
              <span
                aria-hidden
                className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors duration-200 ${
                  selected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon size={21} />
              </span>
              <span className="flex flex-col gap-0.5 pr-6">
                <span className="text-base font-semibold text-gray-900">
                  {ACTIVITY_TYPE_LABELS[type]}
                </span>
                <span className="text-sm text-gray-500">
                  {ACTIVITY_TYPE_DESCRIPTIONS[type]}
                </span>
              </span>
              <span
                aria-hidden
                className={`absolute right-3 top-3 grid size-5 place-items-center rounded-full text-white transition-all duration-200 ${
                  selected ? "bg-primary opacity-100" : "opacity-0"
                }`}
              >
                <IconCheck size={12} strokeWidth={3} />
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">Em breve:</span>
        {FUTURE_ACTIVITY_TYPES.map((type) => (
          <Badge key={type}>{ACTIVITY_TYPE_LABELS[type]}</Badge>
        ))}
      </div>
    </fieldset>
  );
}
