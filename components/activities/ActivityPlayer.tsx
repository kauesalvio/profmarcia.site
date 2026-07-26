"use client";

import { Crossword } from "@/components/activities/Crossword";
import { Form } from "@/components/activities/Form";
import { Memory } from "@/components/activities/Memory";
import { Quiz } from "@/components/activities/Quiz";
import { WordSearch } from "@/components/activities/WordSearch";
import type { ActivityPlayerProps } from "@/components/activities/types";

/** Renderiza o componente da atividade conforme o tipo escolhido pela professora. */
export function ActivityPlayer(props: ActivityPlayerProps) {
  switch (props.activity.type) {
    case "quiz":
      return <Quiz {...props} />;
    case "form":
      return <Form {...props} />;
    case "crossword":
      return <Crossword />;
    case "wordsearch":
      return <WordSearch />;
    case "memory":
      return <Memory />;
  }
}
