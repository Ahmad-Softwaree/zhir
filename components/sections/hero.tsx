"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/shared/animate";

export default function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden py-20">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <AnimateOnScroll animation="fade-up" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t("poweredBy")}
            </span>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={0.2}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {t("title")}
          </h1>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={0.3}>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="text-base px-8 py-6 rounded-full group">
              <Link href="/chat">
                {t("goToChat")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 rounded-full">
              <Link href="/login">{t("learnMore")}</Link>
            </Button>
          </div>
        </AnimateOnScroll>

        {/* Floating elements */}
        <AnimateOnScroll animation="fade-up" delay={0.6}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("features.intelligentResponses.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("features.intelligentResponses.description")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("features.naturalDialogue.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("features.naturalDialogue.description")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("features.alwaysLearning.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("features.alwaysLearning.description")}
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
