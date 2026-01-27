"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, LogIn, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { ENUMs } from "@/lib/enums";
import { usePathname } from "@/i18n/navigation";

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const isHomePage = pathname === ENUMs.PAGES.HOME;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 md:h-18 items-center justify-between">
        {/* Logo and Project Name */}
        <Link
          href={ENUMs.PAGES.HOME}
          className="flex items-center gap-2 md:gap-3 group">
          <div className="relative w-9 h-9 md:w-11 md:h-11 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain rounded-xl p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline">
              {t("header.projectName")}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              asChild>
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                {t("header.login")}
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              asChild>
              <Link href="/signup">
                <Sparkles className="h-4 w-4 mr-2" />
                {t("header.signUp")}
              </Link>
            </Button>
          </div>

          {!isHomePage && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
              asChild>
              <Link href={ENUMs.PAGES.HOME} aria-label={t("header.home")}>
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          )}

          <ThemeToggle />
          <LangToggle />
        </div>
      </div>
    </header>
  );
}
