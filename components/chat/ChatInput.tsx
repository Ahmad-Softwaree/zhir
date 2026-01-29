"use client";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { sendChat } from "@/lib/actions/chat.action";
import { useChatStore } from "@/lib/store/chat.store";
import { useParams, useRouter } from "next/navigation";
import { handleMutationError } from "@/lib/error-handler";

const ChatInput = () => {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations("chat");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    setUserMessage,
    appendToResponse,
    setStreaming,
    resetChat,
    newChatId,
    setNewChatId,
  } = useChatStore();

  useEffect(() => {
    if (newChatId && !isLoading) {
      router.push(`/chat/${newChatId}`);
      setNewChatId(null);
    }
  }, [newChatId, isLoading, router, setNewChatId]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    setUserMessage(userMessage);

    try {
      await sendChat(
        userMessage,
        id ? String(id) : undefined,
        (chunk) => {
          appendToResponse(chunk);
        },
        () => {
          setStreaming(false);
          setIsLoading(false);
          resetChat();
        },
        (chatId) => {
          if (!id) {
            setNewChatId(chatId);
          }
        }
      );
    } catch (error) {
      console.log(error);
      handleMutationError(error, t, t("errors.sendMessageFailed"), (msg) => {
        toast.error(msg);
      });
      setIsLoading(false);
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            value={input}
            disabled={isLoading}
            className="resize-none min-h-[60px] max-h-[200px] pr-4 py-3 rounded-2xl border-2 focus-visible:ring-2 focus-visible:ring-primary transition-all"
            placeholder={t("input.placeholder")}
            rows={1}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          size="icon"
          className="h-[60px] w-[60px] rounded-2xl transition-all hover:scale-105">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2 max-w-4xl mx-auto">
        {t("input.hint")}
      </p>
    </div>
  );
};

export default ChatInput;
