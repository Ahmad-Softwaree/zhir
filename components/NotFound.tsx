"use client";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
const NotFoundComponent = () => {
  const t = useTranslations("notFound");
  const locale = useLocale();
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Elegant Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <div className="english_font z-50 text-9xl md:text-[12rem] font-bold bg-gradient-to-br from-primary/20 to-accent/20 bg-clip-text text-transparent select-none">
            404
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("pageNotFound")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            {t("pageNotFoundDescription")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" className="min-w-[160px] rounded-full" asChild>
            <Link href={`/${locale}`}>
              <Home className="mr-2 h-5 w-5" />
              {t("returnHome")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundComponent;
