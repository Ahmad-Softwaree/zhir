export const ENUMs = {
  GLOBAL: {
    PER_PAGE: 30,
    DEFAULT_LANG: "ckb",
  },
  TAGS: {
    CHATS: "chats",
    CHAT: "chat",
  },
  PAGES: {
    HOME: "/",
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    CHAT: "/chat",
  },
} as const;

export type ENUMSs = typeof ENUMs;

export type TAGs = ENUMSs["TAGS"][keyof ENUMSs["TAGS"]];
