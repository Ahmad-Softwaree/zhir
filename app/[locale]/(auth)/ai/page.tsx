"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import FeatureCard from "@/components/cards/FeatureCard";
import { features } from "@/components/sections/features";

const ChatSelectionPage = () => {
  const t = useTranslations("chatSelection");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("title")}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((val) => (
            <FeatureCard key={val.id} {...val} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSelectionPage;
