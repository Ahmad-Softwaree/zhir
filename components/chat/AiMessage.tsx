"use client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
import { Bot } from "lucide-react";
import Markdown from "react-markdown";
export const AiMessage = ({
  message,
  isStreaming,
}: {
  message: string;
  isStreaming?: boolean;
}) => {
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback className="bg-purple-600 text-white">
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <Card className="p-4 max-w-[80%] bg-muted">
        <Markdown>{message}</Markdown>
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
        )}
      </Card>
    </div>
  );
};
