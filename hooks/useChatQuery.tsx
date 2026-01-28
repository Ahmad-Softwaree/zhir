"use client";

import { useQueryStates, parseAsString } from "nuqs";

export function useChatQuery() {
  return useQueryStates({
    chat: parseAsString.withDefault("").withOptions({
      shallow: false,
    }),
  });
}

export type ChatQueryParams = ReturnType<typeof useChatQuery>[0];
