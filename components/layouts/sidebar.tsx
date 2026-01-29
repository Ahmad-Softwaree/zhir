"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Sparkles, Hash } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createNewChat } from "@/lib/actions/chat.server.action";
import { toast } from "sonner";
import { IChat } from "@/lib/db/models/Chat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NoData from "../shared/NoData";
import ChatCard from "../cards/ChatCard";
import { useChatStore } from "@/lib/store/chat.store";

export type Chat = IChat & {
  id: string;
  lastMessage: string;
};

const CustomSidebar = ({ chats }: { chats: Chat[] }) => {
  const locale = useLocale();
  const t = useTranslations("chat.sidebar");
  const chat_t = useTranslations("chat");
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const { isStreaming } = useChatStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleNewChat = async () => {
    setCreating(true);
    try {
      const result = await createNewChat();
      if (result && !(result as any).__isError) {
        router.push(`/${locale}/chat/${result.id}`);
        router.refresh();
      } else {
        toast.error(chat_t("errors.createChatFailed"));
      }
    } catch (error) {
      toast.error(chat_t("errors.createChatFailed"));
    } finally {
      setCreating(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon" side={locale == "en" ? "left" : "right"}>
        <SidebarRail />

        {/* Header */}
        <SidebarHeader
          className={cn(
            "border-b transition-all",
            isCollapsed ? "p-2" : "p-4"
          )}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-bold text-lg">{t("title")}</h2>
                </div>
              </div>
              <Button
                onClick={() => router.push(`/${locale}/chat`)}
                disabled={creating || isStreaming}
                className="w-full gap-2"
                variant="default">
                {t("chat")}
              </Button>
              <Button
                onClick={handleNewChat}
                disabled={creating || isStreaming}
                className="w-full gap-2"
                variant="default">
                <Plus className="h-4 w-4" />
                {creating ? "Creating..." : t("newChat")}
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t("title")}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNewChat}
                    disabled={creating || isStreaming}
                    size="icon"
                    className="h-9 w-9"
                    variant="default">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{creating ? "Creating..." : t("newChat")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </SidebarHeader>

        {/* Content */}
        <SidebarContent
          className={cn("transition-all", isCollapsed ? "p-2" : "p-3")}>
          <div className="flex flex-col gap-2">
            {chats?.map((chat) => {
              return (
                <ChatCard key={chat.id} chat={chat} isCollapsed={isCollapsed} />
              );
            })}

            {chats?.length === 0 && !isCollapsed && <NoData />}
          </div>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter
          className={cn(
            "border-t transition-all",
            isCollapsed ? "p-2" : "p-4"
          )}>
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("totalChats")}</span>
                <span className="font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {chats.length}
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                {t("footer")}
              </div>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center justify-center">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hash className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary mt-1">
                    {chats.length}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>
                  {t("totalChats")}: {chats.length}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
};

export default CustomSidebar;
