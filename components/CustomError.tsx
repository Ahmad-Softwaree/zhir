"use client";
import { Button } from "@/components/ui/button";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function CustomError() {
  const t = useTranslations("error");
  const locale = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Error Icon */}
        <div className="relative flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-red-500" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="max-w-lg mx-auto p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <p className="text-sm text-destructive font-mono text-left break-all">
            An unexpected error has occurred.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            className="min-w-[160px] rounded-full"
            onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-5 w-5" />
            {t("tryAgain")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[160px] rounded-full"
            asChild>
            <Link href={`/${locale}`}>
              <Home className="mr-2 h-5 w-5" />
              {t("returnHome")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
