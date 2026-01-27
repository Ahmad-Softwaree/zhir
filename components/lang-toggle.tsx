"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { Button } from "./ui/button";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1200]" align="end">
        {routing.locales.map((val, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => router.replace(pathname, { locale: val })}
            className={`${
              locale === val ? "bg-primary text-primary-foreground" : ""
            } focus:bg-primary focus:text-primary-foreground transition-colors duration-200 cursor-pointer ${
              val === "en"
                ? "english_font"
                : val === "ar"
                ? "arabic_font"
                : "kurdish_font"
            }`}>
            {String(t(`langs.${val}` as any))}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
