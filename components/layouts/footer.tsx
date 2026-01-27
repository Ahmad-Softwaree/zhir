"use client";

import { Github, ExternalLink, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ENUMs } from "@/lib/enums";
import Link from "next/link";
import { usePathname } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const isHomePage = pathname === ENUMs.PAGES.HOME;
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" bg-background/50 backdrop-blur-sm py-8 mt-auto">
      <Separator className="mb-6 opacity-50" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
          <p className="text-center">
            © {currentYear}{" "}
            <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("header.projectName")}
            </span>
            . {t("footer.rights")}.
          </p>
          <span className="hidden sm:inline">•</span>
          <p className="english_font flex items-center gap-1.5">
            Made with{" "}
            <Heart className="w-3.5 h-3.5 text-destructive fill-destructive animate-pulse" />{" "}
            by Ahmad
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 md:gap-4">
          {isHomePage && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary transition-all group"
                asChild>
                <Link
                  href="https://github.com/Ahmad-Softwaree"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  {t("footer.github")}
                </Link>
              </Button>

              <div className="w-px h-5 bg-border/50" />

              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-secondary/10 hover:text-secondary transition-all group"
                asChild>
                <Link
                  href="https://ahmad-software.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  {t("footer.portfolio")}
                  <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
