import { normalizeWord } from "@/lib/puzzle";
import type { ActivityConfig, DecorationImage, Question } from "@/lib/types";

const KAHOOT_HOSTS = ["kahoot.it", "kahoot.com"];

export function normalizeKahootUrl(raw: unknown) {
  if (raw === undefined || raw === null || raw === "") return undefined;
  if (typeof raw !== "string" || raw.length > 500) return null;
  try {
    const url = new URL(raw.trim());
    const validHost = KAHOOT_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
    return url.protocol === "https:" && validHost ? url.toString() : null;
  } catch {
    return null;
  }
}

function decoration(raw: unknown): DecorationImage | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const image = raw as Record<string, unknown>;
  if (
    typeof image.id !== "string" ||
    !/^[a-f0-9-]{36}$/i.test(image.id) ||
    typeof image.title !== "string" ||
    typeof image.license !== "string" ||
    typeof image.sourceUrl !== "string"
  ) {
    return undefined;
  }
  try {
    const source = new URL(image.sourceUrl);
    if (source.protocol !== "https:") return undefined;
  } catch {
    return undefined;
  }
  return {
    id: image.id,
    title: image.title.trim().slice(0, 200) || "Imagem sem título",
    ...(typeof image.creator === "string" && image.creator.trim()
      ? { creator: image.creator.trim().slice(0, 160) }
      : {}),
    license: image.license.trim().slice(0, 40),
    sourceUrl: image.sourceUrl.slice(0, 1000),
  };
}

export function sanitizeActivityConfig(raw: unknown): ActivityConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const config = raw as Record<string, unknown>;
  if (!Array.isArray(config.questions) || config.questions.length === 0 || config.questions.length > 50)
    return null;

  const questions: Question[] = [];
  for (const item of config.questions) {
    if (!item || typeof item !== "object") return null;
    const source = item as Record<string, unknown>;
    const label = typeof source.label === "string" ? source.label.trim().slice(0, 300) : "";
    if (!label) return null;
    const image = decoration(source.decoration);
    const base = { label, ...(image ? { decoration: image } : {}) };

    if (source.type === "quiz") {
      if (!Array.isArray(source.options)) return null;
      const options = source.options
        .filter((option): option is string => typeof option === "string")
        .map((option) => option.trim().slice(0, 200))
        .filter(Boolean)
        .slice(0, 10);
      const correctAnswer =
        typeof source.correctAnswer === "string" ? source.correctAnswer.trim().slice(0, 200) : null;
      if (options.length < 2 || !correctAnswer || !options.includes(correctAnswer)) return null;
      questions.push({ ...base, type: "quiz", options, correctAnswer });
      continue;
    }

    if (source.type === "image-quiz") {
      if (!Array.isArray(source.options) || source.options.length < 2 || source.options.length > 4)
        return null;
      const options: DecorationImage[] = [];
      for (const rawOption of source.options) {
        const option = decoration(rawOption);
        if (!option) return null;
        options.push(option);
      }
      const correctAnswer =
        typeof source.correctAnswer === "string" ? source.correctAnswer : null;
      if (!correctAnswer || !options.some((option) => option.id === correctAnswer)) return null;
      questions.push({ ...base, type: "image-quiz", options, correctAnswer });
      continue;
    }

    if (source.type === "crossword" || source.type === "wordsearch") {
      if (!Array.isArray(source.words)) return null;
      const words = source.words
        .filter((word): word is Record<string, unknown> => !!word && typeof word === "object")
        .map((word) => ({
          word: normalizeWord(typeof word.word === "string" ? word.word : "").slice(0, 30),
          ...(typeof word.clue === "string" && word.clue.trim()
            ? { clue: word.clue.trim().slice(0, 300) }
            : {}),
        }))
        .filter((word) => word.word.length >= 2)
        .slice(0, 40);
      if (words.length < 2) return null;
      const gridSize = Math.min(20, Math.max(5, Number(source.gridSize) || 10));
      questions.push({
        ...base,
        type: source.type,
        words,
        ...(source.type === "wordsearch" ? { gridSize } : {}),
      });
      continue;
    }

    if (source.type === "text" || source.type === "textarea") {
      questions.push({ ...base, type: source.type });
      continue;
    }

    return null;
  }

  const settings =
    config.settings && typeof config.settings === "object"
      ? (config.settings as Record<string, unknown>)
      : {};
  const kahootUrl = normalizeKahootUrl(settings.kahootUrl);
  if (kahootUrl === null) return null;

  return {
    questions,
    settings: { ...(kahootUrl ? { kahootUrl } : {}) },
  };
}
