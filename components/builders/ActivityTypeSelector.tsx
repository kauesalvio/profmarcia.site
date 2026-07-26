"use client";

import { Badge } from "@/components/ui/Card";
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
          return (
            <label
              key={type}
              className={`flex cursor-pointer gap-3 rounded-md border p-4 transition-colors duration-200 ${
                selected
                  ? "border-primary bg-primary-light"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="activity-type"
                className="mt-1 size-4 accent-primary"
                checked={selected}
                onChange={() => onChange(type)}
              />
              <span className="flex flex-col gap-1">
                <span className="text-base font-semibold text-gray-900">
                  {ACTIVITY_TYPE_LABELS[type]}
                </span>
                <span className="text-sm text-gray-500">
                  {ACTIVITY_TYPE_DESCRIPTIONS[type]}
                </span>
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
