"use client";
import { useChatStore } from "@/lib/store/chat.store";
import { UserMessage } from "./UserMessage";
import { AiMessage } from "./AiMessage";
import { IChat } from "@/lib/db/models/Chat";
import { useEffect, useRef } from "react";

const ChatMessages = ({ data }: { data: IChat }) => {
  const { currentUserMessage, currentAiResponse, isStreaming } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentAiResponse, currentUserMessage, isStreaming]);
  return (
    <div className="space-y-6">
      {data.conversations?.map((chat, index) => (
        <div key={index} className="space-y-4">
          <UserMessage message={chat.userMessage} />
          <AiMessage message={chat.aiResponse} />
        </div>
      ))}

      {currentUserMessage && (
        <div className="space-y-4">
          <UserMessage message={currentUserMessage} />
          <AiMessage message={currentAiResponse} isStreaming={isStreaming} />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
