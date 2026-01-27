"use client";

import { useQueryStates, parseAsString } from "nuqs";

export function useSearchQuery() {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({
      shallow: false,
    }),
  });
}

export type SearchQueryParams = ReturnType<typeof useSearchQuery>[0];
