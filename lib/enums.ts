export const ENUMs = {
  GLOBAL: {
    PER_PAGE: 30,
    DEFAULT_LANG: "ckb",
  },
  TAGS: {
    CHATS: "chats",
    CHAT: "chat",
    BLOGS: "blogs",
    BLOG: "blog",
  },
  PAGES: {
    HOME: "/",
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    CHAT: "/chat",
    AI: "/ai",
    CONVERSATION: "/conversation/chat",
    BLOG: "/blog/chat",
  },
} as const;

export type ENUMSs = typeof ENUMs;

export type TAGs = ENUMSs["TAGS"][keyof ENUMSs["TAGS"]];
