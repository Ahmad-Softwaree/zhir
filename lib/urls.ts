export const URLs = {
  // Chat endpoints
  CREATE_OR_UPDATE_CHAT: "/chat",
  CREATE_NEW_CHAT: "/chat/new",
  GET_CHAT: (id: string) => `/chat/${id}`,
  DELETE_CHAT: "/chat",
  GET_ALL_CHATS: "/chats",
  OPEN_AI: "/openai",
} as const;
