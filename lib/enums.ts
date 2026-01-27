export const ENUMs = {
  GLOBAL: {
    PER_PAGE: 30,
    DEFAULT_LANG: "ckb",
  },
  TAGS: {},
  PAGES: {
    HOME: "/",
  },
} as const;

export type ENUMSs = typeof ENUMs;
// Type for Tags from the values

export type TAGs = ENUMSs["TAGS"][keyof ENUMSs["TAGS"]];
