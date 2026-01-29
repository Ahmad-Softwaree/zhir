import { handleServerError } from "../error-handler";
import { URLs } from "../urls";
import { revalidateChats } from "./chat.server.action";

export const sendChat = async (
  message: string,
  chatId: string | undefined,
  onChunk?: (text: string) => void,
  onComplete?: () => void,
  onNewChatId?: (chatId: string) => void
) => {
  try {
    const response = await fetch(`/api/${URLs.GENERATE_CHAT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, chatId }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
        statusCode: response.status,
      }));
      let obj = {
        __isError: true,
        ...error,
        statusCode: error.statusCode || response.status,
      } as any;
      onComplete?.();
      throw obj;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        await revalidateChats();
        onComplete?.();
        break;
      }

      const text = decoder.decode(value, { stream: true });
      buffer += text;

      const startMatch = buffer.match(/__START__(.*?)__START__\n/);
      if (startMatch) {
        try {
          const startData = JSON.parse(startMatch[1]);
          if (startData.type === "start" && startData.chatId) {
            onNewChatId?.(startData.chatId);
          }
        } catch (e) {
          console.error("Failed to parse start message:", e);
        }
        buffer = buffer.replace(/__START__(.*?)__START__\n/, "");
      }

      const endMatch = buffer.match(/\n__END__(.*?)__END__/);
      if (endMatch) {
        buffer = buffer.replace(/\n__END__(.*?)__END__/, "");
        if (buffer) {
          onChunk?.(buffer);
        }
        break;
      }

      if (
        buffer &&
        !buffer.includes("__START__") &&
        !buffer.includes("__END__")
      ) {
        onChunk?.(buffer);
        buffer = "";
      }
    }

    await revalidateChats();
    onComplete?.();

    return { success: true };
  } catch (error) {
    onComplete?.();
    throw handleServerError(error) as any;
  }
};
