"use client";
import { Chat } from "../layouts/sidebar";
import { useLocale } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/navigation";
import { MessageSquare } from "lucide-react";
const ChatCard = ({
  chat,
  isCollapsed,
}: {
  chat: Chat;
  isCollapsed: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname.includes(`/chat/${chat.id}`);

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  if (isCollapsed) {
    return (
      <Tooltip key={chat.id}>
        <TooltipTrigger asChild>
          <Card
            onClick={() => handleChatClick(chat.id)}
            className={cn(
              "p-2 cursor-pointer transition-all hover:shadow-md flex items-center justify-center aspect-square",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-lg ring-2 ring-primary/20"
                : "hover:bg-muted/50"
            )}>
            <MessageSquare
              className={cn(
                "h-5 w-5",
                isActive ? "text-primary-foreground" : "text-muted-foreground"
              )}
            />
          </Card>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{chat.title}</p>
            <p className="text-xs text-muted-foreground">{chat.lastMessage}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Card
      key={chat.id}
      onClick={() => handleChatClick(chat.id)}
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md",
        isActive
          ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
          : "hover:bg-muted/50"
      )}>
      <div className="flex items-start gap-3">
        <MessageSquare
          className={cn(
            "h-5 w-5 mt-0.5 flex-shrink-0",
            isActive ? "text-primary-foreground" : "text-muted-foreground"
          )}
        />
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "font-semibold text-sm mb-1 truncate",
              isActive ? "text-primary-foreground" : ""
            )}>
            {chat.title}
          </div>
          <div
            className={cn(
              "text-xs truncate",
              isActive ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
            {chat.lastMessage}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
