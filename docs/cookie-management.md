# Cookie Management with cookies-next

**⚠️ CRITICAL: READ BEFORE IMPLEMENTING COOKIE FEATURES**

This document outlines the cookie management standards using **cookies-next** in this Next.js project.

---

## 🚨 CRITICAL: Cookie Library

- **ONLY use `cookies-next`** - This is the ONLY cookie library allowed
- **NEVER use** `js-cookie`, `universal-cookie`, `react-cookie`, or native `document.cookie`
- **cookies-next** is the official recommended library for Next.js cookie handling

---

## 📦 Installation

Already installed in this project:

```bash
bun add cookies-next
```

---

## 🏗️ Architecture

### Client-Side vs Server-Side

**cookies-next** provides separate imports for client and server contexts:

```typescript
// Client-side (use in Client Components)
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

// Server-side (use in Server Components, Server Actions, API Routes)
import { getCookie, setCookie, deleteCookie } from "cookies-next/server";
```

---

## 📖 Usage Examples

### Client Components

```typescript
"use client";

import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

export function ThemeToggle() {
  const handleThemeChange = (theme: string) => {
    // Set cookie (expires in 365 days by default)
    setCookie("theme", theme, {
      maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    });
  };

  const getTheme = () => {
    const theme = getCookie("theme");
    return theme || "light";
  };

  const clearTheme = () => {
    deleteCookie("theme");
  };

  return <div>Theme Toggle Component</div>;
}
```

### Server Components

```typescript
import { getCookie, setCookie } from "cookies-next/server";

export default async function ProfilePage() {
  // Get cookie value
  const lang = await getCookie("lang");

  return <div>Language: {lang}</div>;
}
```

### Server Actions

```typescript
"use server";

import { setCookie, getCookie } from "cookies-next/server";

export async function updateLanguage(lang: string) {
  // Set cookie with options
  setCookie("lang", lang, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { success: true };
}

export async function getLanguage() {
  const lang = await getCookie("lang");
  return lang || "en";
}
```

### API Routes

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getCookie, setCookie } from "cookies-next/server";

export async function GET(request: NextRequest) {
  const token = await getCookie("token");

  return NextResponse.json({ token });
}

export async function POST(request: NextRequest) {
  const { value } = await request.json();

  setCookie("custom-value", value, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return NextResponse.json({ success: true });
}
```

---

## 🎯 Common Use Cases

### 1. Theme Persistence

```typescript
"use client";

import { getCookie, setCookie } from "cookies-next/client";
import { ENUMs } from "@/lib/enums";

export function saveTheme(theme: "light" | "dark") {
  setCookie(ENUMs.GLOBAL.THEME_COOKIE, theme, {
    maxAge: 365 * 24 * 60 * 60,
  });
}

export function getTheme(): string | undefined {
  return getCookie(ENUMs.GLOBAL.THEME_COOKIE);
}
```

### 2. Language Persistence

```typescript
"use client";

import { getCookie, setCookie } from "cookies-next/client";
import { ENUMs } from "@/lib/enums";

export function saveLanguage(lang: string) {
  setCookie(ENUMs.GLOBAL.LANG_COOKIE, lang, {
    maxAge: 365 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });
}

export function getLanguage(): string {
  return getCookie(ENUMs.GLOBAL.LANG_COOKIE) || "en";
}
```

### 3. Authentication Token

```typescript
"use server";

import { getCookie, setCookie, deleteCookie } from "cookies-next/server";

export async function saveAuthToken(token: string) {
  const maxAge =
    parseInt(process.env.NEXT_PUBLIC_JWT_EXPIRY_DAYS || "30") * 24 * 60 * 60;

  setCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

export async function getAuthToken(): Promise<string | undefined> {
  return await getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
}

export async function clearAuthToken() {
  deleteCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
}
```

### 4. User Preferences

```typescript
"use client";

import { getCookie, setCookie } from "cookies-next/client";

interface UserPreferences {
  sidebarCollapsed: boolean;
  itemsPerPage: number;
  sortOrder: "asc" | "desc";
}

export function savePreferences(prefs: UserPreferences) {
  setCookie("user_preferences", JSON.stringify(prefs), {
    maxAge: 365 * 24 * 60 * 60,
  });
}

export function getPreferences(): UserPreferences | null {
  const prefs = getCookie("user_preferences");
  return prefs ? JSON.parse(prefs) : null;
}
```

---

## ⚙️ Cookie Options

### Available Options

```typescript
interface CookieOptions {
  maxAge?: number; // Seconds until expiry
  expires?: Date; // Expiration date
  path?: string; // Cookie path (default: "/")
  domain?: string; // Cookie domain
  secure?: boolean; // HTTPS only
  httpOnly?: boolean; // Not accessible via JavaScript (server-side only)
  sameSite?: "strict" | "lax" | "none"; // CSRF protection
}
```

### Common Configurations

#### Short-term Cookie (Session)

```typescript
setCookie("session_id", value, {
  maxAge: 60 * 60, // 1 hour
  sameSite: "lax",
});
```

#### Long-term Cookie (Persistent)

```typescript
setCookie("user_preferences", value, {
  maxAge: 365 * 24 * 60 * 60, // 1 year
  path: "/",
  sameSite: "lax",
});
```

#### Secure Cookie (Production)

```typescript
setCookie("auth_token", value, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60, // 30 days
});
```

---

## 🔒 Security Best Practices

### 1. Authentication Tokens

✅ **DO:**

- Use `httpOnly: true` to prevent XSS attacks
- Use `secure: true` in production (HTTPS only)
- Use `sameSite: "strict"` or `"lax"` for CSRF protection
- Set reasonable expiration times

```typescript
setCookie("token", value, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60, // 7 days
});
```

❌ **DON'T:**

- Store sensitive data in client-accessible cookies
- Use long expiration times for auth tokens
- Set cookies without `sameSite` protection

### 2. User Preferences

✅ **DO:**

- Use client-side cookies for UI preferences
- Validate cookie values before use
- Set reasonable size limits

```typescript
const prefs = getCookie("theme");
if (prefs === "dark" || prefs === "light") {
  // Valid value
}
```

### 3. Cross-Site Considerations

```typescript
// Strict: Only same-site requests
setCookie("csrf_token", value, { sameSite: "strict" });

// Lax: Same-site + top-level navigation (recommended)
setCookie("session", value, { sameSite: "lax" });

// None: Allow cross-site (requires secure: true)
setCookie("tracking", value, { sameSite: "none", secure: true });
```

---

## 📋 Standard Cookie Names (ENUMs)

**File**: `lib/enums.ts`

```typescript
export const ENUMs = {
  GLOBAL: {
    THEME_COOKIE: "theme",
    LANG_COOKIE: "lang",
    COOKIE_NAME: process.env.NEXT_PUBLIC_COOKIE_NAME,
  },
};
```

**Usage**:

```typescript
import { ENUMs } from "@/lib/enums";

setCookie(ENUMs.GLOBAL.THEME_COOKIE, "dark");
setCookie(ENUMs.GLOBAL.LANG_COOKIE, "en");
```

---

## 🚫 What NOT to Use

### ❌ FORBIDDEN

**DO NOT use these cookie libraries:**

- `js-cookie` - Use cookies-next instead
- `universal-cookie` - Use cookies-next instead
- `react-cookie` - Use cookies-next instead
- `nookies` - Use cookies-next instead
- Native `document.cookie` - Use cookies-next instead

**Why cookies-next?**

- ✅ Built specifically for Next.js App Router
- ✅ Works in both Client and Server Components
- ✅ Handles Server Actions correctly
- ✅ Type-safe
- ✅ Officially recommended by Next.js team

---

## 🔍 Debugging

### Check Cookie Value

```typescript
// Client Component
import { getCookie } from "cookies-next/client";
console.log("Cookie value:", getCookie("theme"));

// Server Component
import { getCookie } from "cookies-next/server";
const value = await getCookie("theme");
console.log("Cookie value:", value);
```

### Browser DevTools

1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Cookies** in sidebar
4. Select your domain
5. View all cookies and their values

---

## 📚 Migration Guide

### From js-cookie

**Before:**

```typescript
import Cookies from "js-cookie";

Cookies.set("theme", "dark", { expires: 365 });
const theme = Cookies.get("theme");
Cookies.remove("theme");
```

**After:**

```typescript
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

setCookie("theme", "dark", { maxAge: 365 * 24 * 60 * 60 });
const theme = getCookie("theme");
deleteCookie("theme");
```

### From document.cookie

**Before:**

```typescript
document.cookie = `theme=dark; max-age=${365 * 24 * 60 * 60}`;
const theme = document.cookie
  .split("; ")
  .find((row) => row.startsWith("theme="))
  ?.split("=")[1];
```

**After:**

```typescript
import { getCookie, setCookie } from "cookies-next/client";

setCookie("theme", "dark", { maxAge: 365 * 24 * 60 * 60 });
const theme = getCookie("theme");
```

---

## ✅ Checklist

Before implementing cookies:

- [ ] Using `cookies-next` library (NOT js-cookie or others)
- [ ] Using correct import (`/client` or `/server`)
- [ ] Setting appropriate `maxAge` (in seconds)
- [ ] Using `httpOnly: true` for sensitive cookies
- [ ] Using `secure: true` in production
- [ ] Using `sameSite` for CSRF protection
- [ ] Cookie name defined in ENUMs
- [ ] Validating cookie values before use

---

## 📖 References

- [cookies-next Documentation](https://www.npmjs.com/package/cookies-next)
- [Next.js Cookies Documentation](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [MDN Cookie Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

**Remember**: Always use `cookies-next` for cookie management in Next.js applications!
