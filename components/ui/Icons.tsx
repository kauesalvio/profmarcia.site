import type { ComponentProps } from "react";
import type { QuestionType } from "@/lib/types";

type IconProps = ComponentProps<"svg"> & { size?: number };

function createIcon(name: string, children: React.ReactNode) {
  function Icon({ size = 20, className, ...props }: IconProps) {
    return (
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {children}
      </svg>
    );
  }
  Icon.displayName = `Icon${name}`;
  return Icon;
}

/** Logo do site: monitor com "play" (aulas de informática). */
export const IconMonitor = createIcon(
  "Monitor",
  <>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M10 8.5v4l3.5-2z" fill="currentColor" stroke="none" />
    <path d="M8 21h8m-4-4v4" />
  </>,
);

export const IconUsers = createIcon(
  "Users",
  <>
    <circle cx="9" cy="8" r="3.25" />
    <path d="M3.5 19.5c.6-3 2.8-4.75 5.5-4.75s4.9 1.75 5.5 4.75" />
    <path d="M15.5 5.4a3.25 3.25 0 0 1 0 5.2M17.6 15.1c1.5.7 2.5 2.2 2.9 4.4" />
  </>,
);

export const IconClipboard = createIcon(
  "Clipboard",
  <>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4.5V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5v1" />
    <path d="M9 10h6M9 14h6M9 18h3.5" />
  </>,
);

export const IconChart = createIcon(
  "Chart",
  <>
    <path d="M4 4v15a1 1 0 0 0 1 1h15" />
    <path d="M8.5 15.5V11M13 15.5V7.5M17.5 15.5v-3" />
  </>,
);

export const IconPlus = createIcon("Plus", <path d="M12 5v14M5 12h14" />);

export const IconArrowRight = createIcon(
  "ArrowRight",
  <path d="M4.5 12h15m0 0-6-6m6 6-6 6" />,
);

export const IconCheck = createIcon("Check", <path d="m4.5 12.5 5 5 10-11" />);

export const IconChevronDown = createIcon("ChevronDown", <path d="m6 9.5 6 6 6-6" />);

export const IconPencil = createIcon(
  "Pencil",
  <path d="M4 20h4.5L20 8.5a2.1 2.1 0 0 0-3-3L5.5 17 4 20zM14.5 6.5l3 3" />,
);

export const IconTrash = createIcon(
  "Trash",
  <>
    <path d="M4.5 6.5h15M9.5 6V4.5A1.5 1.5 0 0 1 11 3h2a1.5 1.5 0 0 1 1.5 1.5V6" />
    <path d="M6.5 6.5 7.5 20a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-13.5" />
    <path d="M10 10.5v6M14 10.5v6" />
  </>,
);

export const IconSparkles = createIcon(
  "Sparkles",
  <>
    <path d="M12 4.5 13.8 9l4.7 1.8-4.7 1.8L12 17.1l-1.8-4.5L5.5 10.8 10.2 9z" />
    <path d="M19 3.5v3M17.5 5h3M6 17.5v3M4.5 19h3" />
  </>,
);

export const IconLink = createIcon(
  "Link",
  <>
    <path d="M10 14a4.5 4.5 0 0 0 6.4.4l2.4-2.4a4.5 4.5 0 0 0-6.4-6.4l-1.3 1.3" />
    <path d="M14 10a4.5 4.5 0 0 0-6.4-.4l-2.4 2.4a4.5 4.5 0 0 0 6.4 6.4l1.3-1.3" />
  </>,
);

export const IconClock = createIcon(
  "Clock",
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>,
);

export const IconBackpack = createIcon(
  "Backpack",
  <>
    <path d="M6 9a6 6 0 0 1 12 0v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
    <path d="M9.5 4.5v-1A1.5 1.5 0 0 1 11 2h2a1.5 1.5 0 0 1 1.5 1.5v1" />
    <path d="M6 13.5h12M9.5 17h5" />
  </>,
);

export const IconQuiz = createIcon(
  "Quiz",
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.8.3-.9.9-.9 1.7" />
    <path d="M12 16.8h.01" />
  </>,
);

export const IconForm = createIcon(
  "Form",
  <>
    <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
  </>,
);

export const IconGrid = createIcon(
  "Grid",
  <>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16" />
  </>,
);

export const IconSearch = createIcon(
  "Search",
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m19.5 19.5-3.8-3.8" />
  </>,
);

export const IconCards = createIcon(
  "Cards",
  <>
    <rect x="3.5" y="6.5" width="9" height="13" rx="1.5" />
    <path d="M9.5 4.5 18 3l2.5 12.5-3.5.7" />
  </>,
);

export const QUESTION_TYPE_ICONS: Record<
  QuestionType,
  ReturnType<typeof createIcon>
> = {
  text: IconForm,
  textarea: IconForm,
  quiz: IconQuiz,
  crossword: IconGrid,
  wordsearch: IconSearch,
  memory: IconCards,
};
