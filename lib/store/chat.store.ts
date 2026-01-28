import { create } from "zustand";

interface ChatStore {
  currentUserMessage: string;
  currentAiResponse: string;
  isStreaming: boolean;

  // Actions
  setUserMessage: (message: string) => void;
  appendToResponse: (chunk: string) => void;
  setStreaming: (streaming: boolean) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentUserMessage: "",
  currentAiResponse: "",
  isStreaming: false,

  setUserMessage: (message: string) => {
    set({
      currentUserMessage: message,
      currentAiResponse: "",
      isStreaming: true,
    });
  },

  appendToResponse: (chunk: string) => {
    set((state) => ({ currentAiResponse: state.currentAiResponse + chunk }));
  },

  setStreaming: (streaming: boolean) => {
    set({ isStreaming: streaming });
  },

  resetChat: () => {
    set({ currentUserMessage: "", currentAiResponse: "", isStreaming: false });
  },
}));
