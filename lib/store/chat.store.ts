import { create } from "zustand";

interface ChatStore {
  currentUserMessage: string;
  currentAiResponse: string;
  isStreaming: boolean;
  newChatId: string | null;

  // Actions
  setUserMessage: (message: string) => void;
  appendToResponse: (chunk: string) => void;
  setStreaming: (streaming: boolean) => void;
  setNewChatId: (chatId: string | null) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentUserMessage: "",
  currentAiResponse: "",
  isStreaming: false,
  newChatId: null,

  setUserMessage: (message: string) => {
    set({
      currentUserMessage: message,
      currentAiResponse: "",
      isStreaming: true,
      newChatId: null,
    });
  },

  appendToResponse: (chunk: string) => {
    set((state) => ({ currentAiResponse: state.currentAiResponse + chunk }));
  },

  setStreaming: (streaming: boolean) => {
    set({ isStreaming: streaming });
  },

  setNewChatId: (chatId: string | null) => {
    set({ newChatId: chatId });
  },

  resetChat: () => {
    set({
      currentUserMessage: "",
      currentAiResponse: "",
      isStreaming: false,
    });
  },
}));
