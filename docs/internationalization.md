# Internationalization (i18n) with next-intl

**⚠️ CRITICAL: READ BEFORE IMPLEMENTING MULTI-LANGUAGE FEATURES**

This document outlines the internationalization standards and patterns used in this project with **next-intl** for Next.js App Router.

## 📋 Overview

This project uses **next-intl** for multi-language support with the following languages:

- **English (en)** - Default language, LTR
- **Arabic (ar)** - RTL
- **Kurdish/Sorani (ckb)** - RTL

## 🏗️ Architecture

### Directory Structure

```
i18n/
  ├── routing.ts           # next-intl routing configuration
  ├── navigation.ts        # Navigation helpers (Link, useRouter, etc.)
  ├── request.ts           # Server-side request configuration
  └── locales/
      ├── en.json          # English translations
      ├── ar.json          # Arabic translations
      └── ckb.json         # Kurdish translations
```

### Configuration Files

**File**: `i18n/routing.ts`

```typescript
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ar", "ckb"],
  defaultLocale: "en",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

**File**: `i18n/navigation.ts`

```typescript
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

**File**: `i18n/request.ts`

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
```

**Key Points**:

- Define all supported locales
- Set default locale (English)
- Create typed navigation helpers
- Dynamically import translation files

## 🎨 Language Provider

**File**: `providers/language-provider.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ENUMs } from "@/lib/enums";

function LanguageSetup() {
  useEffect(() => {
    const cookieLang = getCookie(ENUMs.GLOBAL.LANG_COOKIE);
    let langToUse = ENUMs.GLOBAL.DEFAULT_LANG as string;

    if (cookieLang && i18n.languages.includes(cookieLang)) {

function LanguageSetup({ locale }: { locale: string }) {
  useEffect(() => {
    document.body.classList.remove(
      "english_font",
      "arabic_font",
      "kurdish_font"
    );

    if (locale === "en") {
      document.body.classList.add("english_font");
      document.dir = "ltr";
    } else if (locale === "ar") {
      document.body.classList.add("arabic_font");
      document.dir = "rtl";
    } else if (locale === "ckb") {
      document.body.classList.add("kurdish_font");
      document.dir = "rtl";
    }
  }, [locale]);

  return null;
}

export default function LanguageProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <NextIntlClientProvider locale={locale}>
      <LanguageSetup locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
```

**Key Responsibilities**:

1. Wrap app with `NextIntlClientProvider`
2. Pass locale from parent (server)
3. Set text direction (`ltr` or `rtl`)
4. Apply language-specific font classes
5. Handle hydration with mounted state

## 🔄 Language Toggle Component

**File**: `components/lang-toggle.tsx`

```typescript
"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {routing.locales.map((val) => (
          <DropdownMenuItem
            key={val}
            onClick={() => router.replace(pathname, { locale: val })}
            className={
              locale === val ? "bg-primary text-primary-foreground" : ""
            }>
            {t(`langs.${val}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Pattern**:

- Use `useLocale()` to get current locale
- Use `useTranslations()` for translations
- Use typed router from `@/i18n/navigation`
- Navigate with `router.replace(pathname, { locale })`
- Highlight active language

## 📝 Translation JSON Structure

**File**: `i18n/locales/en.json`

```json
{
  "langs": {
    "en": "English",
    "ar": "العربية",
    "ckb": "کوردی"
  },
  "app": {
    "title": "FinanceTrack",
    "description": "Track expenses and manage your finances"
  },
  "header": {
    "projectName": "FinanceTrack",
    "home": "Home"
  },
  "auth": {
    "login": "Sign In",
    "register": "Sign Up"
  }
}
```

**Standards**:

- Use nested objects for organization
- Group by feature/section (e.g., `header`, `hero`, `auth`)
- Use descriptive, hierarchical keys
- Keep structure identical across all language files
- All JSON files must have the exact same keys

## 🎯 Usage in Components

### Client Components

```typescript
"use client";

import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t("header.projectName")}</h1>
      <p>{t("hero.subtitle")}</p>
    </div>
  );
}
```

### With Namespace

```typescript
"use client";

import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
    </div>
  );
}
```

### Server Components

**✅ next-intl WORKS in Server Components!**

```typescript
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("home");

  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}
```

## 🍪 Cookie Management (Optional with next-intl)

**Note**: next-intl handles locale detection automatically through URL parameters and middleware. Cookie management for language preference is optional.

If you want to persist language preference in cookies:

```typescript
// Client-side
import { setCookie, getCookie } from "cookies-next/client";

setCookie("NEXT_LOCALE", locale, { maxAge: 365 * 24 * 60 * 60 });
```

## ⚙️ Configuration Constants

**File**: `lib/enums.ts`

```typescript
export const ENUMs = {
  GLOBAL: {
    DEFAULT_LANG: "en",
    LANG_COOKIE: "NEXT_LOCALE",
  },
};
```

## 🎨 Font & Direction Handling

### CSS Classes

**File**: `app/globals.css`

```css
.english_font {
  @apply font-mono;
}

.arabic_font {
  @apply font-tajawal;
}

.kurdish_font {
  @apply font-rudaw;
}
```

### RTL Support

**Direction is automatically handled by next-intl** based on locale, but you can manually set it:

```typescript
useEffect(() => {
  if (locale === "en") {
    document.dir = "ltr";
    document.body.classList.add("english_font");
  } else if (locale === "ar") {
    document.dir = "rtl";
    document.body.classList.add("arabic_font");
  } else if (locale === "ckb") {
    document.dir = "rtl";
    document.body.classList.add("kurdish_font");
  }
}, [locale]);
```

## 🔄 Adding a New Language

1. **Add locale to routing**: `i18n/routing.ts`

   ```typescript
   locales: ["en", "ar", "ckb", "fr"];
   ```

2. **Create translation file**: `i18n/locales/fr.json`

3. **Add language names to all translation files**:

   ```json
   "langs": {
     "en": "English",
     "ar": "العربية",
     "ckb": "کوردی",
     "fr": "Français"
   }
   ```

4. **Add font class** in `globals.css` (if needed)

5. **Update LanguageSetup** in provider (if custom fonts needed)

## 📚 Best Practices

### ✅ DO

- Always use `useTranslations()` for user-facing text
- Keep translation keys descriptive and hierarchical
- Maintain identical structure across all language files
- Use namespace for better organization: `useTranslations("hero")`
- Use typed navigation from `@/i18n/navigation`
- Import Link, useRouter, etc. from `@/i18n/navigation` NOT `next/navigation`
- Test with all languages, especially RTL
- Use TypeScript for type-safe translation keys
- Keep translations consistent across all locales
- Use the typed router from `@/i18n/navigation`

### ❌ DON'T

- Don't hardcode user-facing strings
- Don't use `next/navigation` for routing (use `@/i18n/navigation`)
- Don't forget to add new keys to ALL language files
- Don't nest keys too deeply (max 3-4 levels)
- Don't use special characters in translation keys
- Don't forget to set text direction for RTL languages
- Don't use `useRouter` from `next/navigation` (use from `@/i18n/navigation`)

## 🚀 Quick Start Checklist

When adding new translatable content:

1. ☐ Add translation keys to all JSON files (`en.json`, `ar.json`, `ckb.json`)
2. ☐ Import `useTranslations` from `next-intl`
3. ☐ Use `t("your.key.path")` for translations
4. ☐ Use typed router from `@/i18n/navigation` for navigation
5. ☐ Test in all languages
6. ☐ Verify RTL layout for Arabic/Kurdish

## 📦 Required Packages

```json
{
  "dependencies": {
    "next-intl": "^4.7.0"
  }
}
```

Install with: `bun add next-intl`

## 🔗 Navigation with Locales

**CRITICAL**: Always use navigation helpers from `@/i18n/navigation`, NOT from `next/navigation`

```typescript
// ❌ WRONG - Don't use from next/navigation
import { useRouter, usePathname, Link } from "next/navigation";

// ✅ CORRECT - Use from @/i18n/navigation
import { useRouter, usePathname, Link } from "@/i18n/navigation";
```

**Usage Examples**:

```typescript
import { Link, useRouter, usePathname } from "@/i18n/navigation";

// Link component (automatically includes locale)
<Link href="/dashboard">Dashboard</Link>;

// Router navigation
const router = useRouter();
router.push("/dashboard"); // Preserves current locale

// Change locale
router.replace(pathname, { locale: "ar" });

// Get current pathname (without locale prefix)
const pathname = usePathname(); // Returns "/dashboard" not "/en/dashboard"
```

---

**Version**: 2.0.0  
**Last Updated**: January 22, 2026
**Framework**: next-intl for Next.js App Router
