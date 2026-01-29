"use client";
import { useTranslations, useLocale } from "next-intl";
import { MessageCircle, Sparkles, Plus, Loader2 } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { createNewChat } from "@/lib/actions/chat.server.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const WelcomeMessage = () => {
  const t = useTranslations("chat");
  const locale = useLocale();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleNewChat = async () => {
    setIsCreating(true);
    try {
      const result = await createNewChat();

      if (result && !(result as any).__isError) {
        router.push(`/${locale}/chat/${result.id}`);
        router.refresh();
      } else {
        toast.error("Failed to create new chat. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to create new chat. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="max-w-2xl p-12 text-center space-y-6 border-dashed border-2">
        <div className="flex justify-center">
          <div className="relative">
            <MessageCircle
              className="h-24 w-24 text-primary"
              strokeWidth={1.5}
            />
            <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {t("welcome.title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("welcome.subtitle")}
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleNewChat}
            disabled={isCreating}
            size="lg"
            className="gap-2 text-lg px-8 py-6">
            {isCreating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("welcome.creating")}
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                {t("welcome.startNewChat")}
              </>
            )}
          </Button>
        </div>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground">{t("welcome.hint")}</p>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeMessage;
