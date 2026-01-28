import { revalidateChats } from "./chat.server.action";

// Client-side streaming function (will be called from client component)
export const sendChat = async (
  message: string,
  chatId: string | undefined,
  onChunk?: (text: string) => void,
  onComplete?: () => void
) => {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, chatId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        await revalidateChats();
        onComplete?.();
        break;
      }

      const text = decoder.decode(value, { stream: true });
      if (text) {
        onChunk?.(text);
      }
    }

    return { success: true };
  } catch (error) {
    onComplete?.();
    throw error;
  }
};
