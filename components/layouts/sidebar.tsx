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
import { Plus, Sparkles, Hash, PenLine, Coins, CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";
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
import { IBlog } from "@/lib/db/models/Blog";
import BlogCard from "../cards/BlogCard";
import { useAuthStore } from "@/lib/store/auth.store";
import { addPayment } from "@/lib/actions/payment.action";
import { handleMutationError } from "@/lib/error-handler";

export type Chat = IChat & {
  id: string;
  lastMessage: string;
};

export type Blog = IBlog & {
  id: string;
  lastMessage: string;
};
const CustomSidebar = ({
  data,
  type,
}: {
  data: Chat[] | Blog[];
  type: "conversation" | "blog";
}) => {
  const locale = useLocale();
  const t = useTranslations("chat.sidebar");
  const chat_t = useTranslations("chat");
  const payment_t = useTranslations("payment");
  const coins_t = useTranslations("coins");
  const router = useRouter();
  const pathname = usePathname();
  const [creating, setCreating] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const { isStreaming } = useChatStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { auth } = useAuthStore();

  const isInConversation = pathname.includes("/conversation");
  const isInBlog = pathname.includes("/blog");

  const userCoins = auth?.coins || 0;
  const hasNoCoins = userCoins === 0;

  const handleNewChat = async () => {
    setCreating(true);
    try {
      const result = await createNewChat();
      if (result && !(result as any).__isError) {
        router.push(`/${locale}/ai/conversation/chat/${result.id}`);
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

  const handleBuyCredits = async () => {
    setPurchasing(true);
    try {
      const result = await addPayment();
      if (result && !(result as any).__isError) {
        if ((result as any).url) {
          window.location.href = (result as any).url;
        }
      } else {
        handleMutationError(
          result,
          payment_t,
          payment_t("failed"),
          (message: string) => {
            toast.error(message);
          }
        );
      }
    } catch (error) {
      handleMutationError(
        error,
        payment_t,
        payment_t("failed"),
        (message: string) => {
          toast.error(message);
        }
      );
    } finally {
      setPurchasing(false);
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
                    {type === "blog" ? (
                      <PenLine className="h-4 w-4 text-primary" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <h2 className="font-bold text-lg">{t("title")}</h2>
                </div>
              </div>

              {/* Coin Display */}
              {(isInBlog || isInConversation) && auth && (
                <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">
                        {coins_t("balance")}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-amber-500">
                      {userCoins}
                    </span>
                  </div>
                  {isInBlog && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {coins_t("required")}
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={() =>
                  router.push(
                    `/${locale}/ai/${
                      type === "blog" ? "blog" : "conversation"
                    }/chat`
                  )
                }
                disabled={(isInBlog && hasNoCoins) || creating || isStreaming}
                className="w-full gap-2"
                variant="default">
                {type === "blog" ? t("blog") : t("chat")}
              </Button>
              <Button
                onClick={handleNewChat}
                disabled={(isInBlog && hasNoCoins) || creating || isStreaming}
                className="w-full gap-2"
                variant="default">
                <Plus className="h-4 w-4" />
                {creating
                  ? "Creating..."
                  : type === "blog"
                  ? t("newBlog")
                  : t("newChat")}
              </Button>

              {isInBlog && (
                <Button
                  onClick={handleBuyCredits}
                  disabled={purchasing}
                  className="w-full gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                  variant="default">
                  <CreditCard className="h-4 w-4" />
                  {purchasing
                    ? payment_t("purchasing")
                    : payment_t("buyCredits")}
                </Button>
              )}
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

              {/* Coin Display - Collapsed */}
              {(isInBlog || isInConversation) && auth && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-500/10">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-bold text-amber-500 mt-1">
                        {userCoins}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>
                      {coins_t("balance")}: {userCoins}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNewChat}
                    disabled={
                      (isInBlog && hasNoCoins) || creating || isStreaming
                    }
                    size="icon"
                    className="h-9 w-9"
                    variant="default">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>
                    {creating
                      ? "Creating..."
                      : type === "blog"
                      ? t("newBlog")
                      : t("newChat")}
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Buy Credits Button - Collapsed */}
              {isInBlog && hasNoCoins && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleBuyCredits}
                      disabled={purchasing}
                      size="icon"
                      className="h-9 w-9 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                      variant="default">
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{payment_t("buyCredits")}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </SidebarHeader>

        {/* Content */}
        <SidebarContent
          className={cn("transition-all", isCollapsed ? "p-2" : "p-3")}>
          <div className="flex flex-col gap-2">
            {data?.map((val) => {
              return type === "conversation" ? (
                <ChatCard
                  key={val.id}
                  chat={val as Chat}
                  isCollapsed={isCollapsed}
                />
              ) : (
                <BlogCard
                  key={val.id}
                  chat={val as Blog}
                  isCollapsed={isCollapsed}
                />
              );
            })}

            {data?.length === 0 && !isCollapsed && <NoData />}
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
                <span className="text-muted-foreground">
                  {type === "blog" ? t("totalBlogs") : t("totalChats")}
                </span>
                <span className="font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {data.length}
                </span>
              </div>

              {/* Navigation Link */}
              {isInConversation && (
                <Button
                  onClick={() => router.push(`/${locale}/ai/blog/chat`)}
                  variant="outline"
                  className="w-full gap-2 text-sm">
                  <PenLine className="h-4 w-4" />
                  {t("goToBlog")}
                </Button>
              )}

              {isInBlog && (
                <Button
                  onClick={() => router.push(`/${locale}/ai/conversation/chat`)}
                  variant="outline"
                  className="w-full gap-2 text-sm">
                  <Sparkles className="h-4 w-4" />
                  {t("goToConversation")}
                </Button>
              )}

              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                {t("footer")}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Hash className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-primary mt-1">
                      {data.length}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>
                    {type === "blog" ? t("totalBlogs") : t("totalChats")}:{" "}
                    {data.length}
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Navigation Icon */}
              {isInConversation && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => router.push(`/${locale}/blog/chat`)}
                      size="icon"
                      variant="outline"
                      className="h-9 w-9">
                      <PenLine className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{t("goToBlog")}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {isInBlog && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() =>
                        router.push(`/${locale}/conversation/chat`)
                      }
                      size="icon"
                      variant="outline"
                      className="h-9 w-9">
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{t("goToConversation")}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
};

export default CustomSidebar;
