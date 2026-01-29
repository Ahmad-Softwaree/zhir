"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { MessageSquare, PenLine, Sparkles } from "lucide-react";
import FeatureCard from "../cards/FeatureCard";

export type Feature = {
  id: number;
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  type: "conversation" | "blogGenerator";
  route?: string;
};

export const features: Feature[] = [
  {
    id: 1,
    icon: <MessageSquare className="h-8 w-8" />,
    titleKey: "conversation.title",
    descriptionKey: "conversation.description",
    badge: "conversation.badge",
    badgeVariant: "default",
    type: "conversation",
    route: "/ai/conversation/chat",
  },
  {
    id: 2,
    icon: <PenLine className="h-8 w-8" />,
    titleKey: "blogGenerator.title",
    descriptionKey: "blogGenerator.description",
    badge: "blogGenerator.badge",
    badgeVariant: "secondary",
    type: "blogGenerator",
    route: "/ai/blog/chat",
  },
];

const Features = () => {
  const t = useTranslations("home.features");

  return (
    <section className="py-20">
      {/* Section Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-4xl font-bold tracking-tight">{t("title")}</h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {features.map((feature) => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;
