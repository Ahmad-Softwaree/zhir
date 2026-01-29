export const URLs = {
  // Chat endpoints
  CREATE_OR_UPDATE_CHAT: "/chat",
  CREATE_NEW_CHAT: "/chat/new",
  GET_CHAT: (id: string) => `/chat/${id}`,
  DELETE_CHAT: "/chat",
  GET_ALL_CHATS: "/chats",
  GENERATE_CHAT: "/openai/chat",
  // Blog endpoints
  CREATE_NEW_BLOG: "/blog/new",
  GET_BLOG: (id: string) => `/blog/${id}`,
  DELETE_BLOG: "/blog",
  GET_ALL_BLOGS: "/blogs",
  GENERATE_BLOG: "/openai/blog",
} as const;
