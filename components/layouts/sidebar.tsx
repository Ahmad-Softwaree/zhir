"use client";
import { Card } from "../ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { useLocale, useTranslations } from "next-intl";
import { MessageSquare, Plus, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createNewChat } from "@/lib/actions/chat.server.action";
import { toast } from "sonner";
import { IChat } from "@/lib/db/models/Chat";

export type Chat = IChat & {
  id: string;
  lastMessage: string;
};

const CustomSidebar = ({ chats }: { chats: Chat[] }) => {
  const locale = useLocale();
  const t = useTranslations("chat.sidebar");
  const pathname = usePathname();
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleNewChat = async () => {
    setCreating(true);
    try {
      const result = await createNewChat();

      if (result && !(result as any).__isError && result.chat) {
        router.push(`/${locale}/chat/${result.chat.id}`);
        router.refresh();
      } else {
        toast.error("Failed to create new chat. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to create new chat. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/${locale}/chat/${chatId}`);
  };

  return (
    <Sidebar collapsible="icon" side={locale == "en" ? "left" : "right"}>
      <SidebarRail />

      {/* Header */}
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2 flex-1">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">{t("title")}</h2>
          </div>
        </div>
        <Button
          onClick={handleNewChat}
          disabled={creating}
          className="w-full gap-2"
          variant="default">
          <Plus className="h-4 w-4" />
          {creating ? "Creating..." : t("newChat")}
        </Button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="p-3">
        <div className="flex flex-col gap-2">
          {chats.map((chat) => {
            const isActive = pathname.includes(`/chat/${chat.id}`);

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
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
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
                        isActive
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      )}>
                      {chat.lastMessage}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("totalChats")}</span>
            <span className="font-semibold">{chats.length}</span>
          </div>
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            {t("footer")}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default CustomSidebar;
