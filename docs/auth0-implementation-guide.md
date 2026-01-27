# 🔐 Auth0 Implementation Guide

This guide explains how we implemented Auth0 authentication in the AI Chat project following the latest Auth0 Next.js SDK documentation.

## 📚 What is Auth0?

Auth0 is a flexible, drop-in solution to add authentication and authorization services to your applications. It provides:

- **Social Login** - Google, GitHub, Facebook, etc.
- **Email/Password Authentication**
- **Multi-factor Authentication (MFA)**
- **User Management**
- **Session Management**
- **Security Best Practices**

---

## 🚀 Implementation Overview

We implemented a complete authentication flow with the following features:

1. ✅ **Sign In/Sign Up Pages** - Beautiful UI for authentication
2. ✅ **Protected Routes** - Chat page requires authentication
3. ✅ **Public Routes** - Home page accessible to everyone
4. ✅ **Auto-Redirect** - Authenticated users can't access signin/signup
5. ✅ **User Profile Display** - Avatar and dropdown in header
6. ✅ **Multi-language Support** - Translations in English, Arabic, and Kurdish

---

## 📦 Dependencies

```json
{
  "@auth0/nextjs-auth0": "^4.14.1"
}
```

This is the official Auth0 SDK for Next.js App Router.

---

## 🔧 Configuration

### 1. Environment Variables (`.env`)

```env
AUTH0_DOMAIN=ahmad-software.us.auth0.com
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
AUTH0_SECRET=your_secret_key_here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://ahmad-software.us.auth0.com
```

**Important Environment Variables:**

- `AUTH0_DOMAIN` - Your Auth0 tenant domain
- `AUTH0_CLIENT_ID` - Application client ID from Auth0 dashboard
- `AUTH0_CLIENT_SECRET` - Application client secret (keep this secret!)
- `AUTH0_SECRET` - Random 32-character string for session encryption
- `AUTH0_BASE_URL` - Your application URL (use production URL in production)
- `AUTH0_ISSUER_BASE_URL` - Full URL to your Auth0 domain

**How to generate `AUTH0_SECRET`:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📁 File Structure

```
app/
├── api/
│   └── auth/
│       └── [auth0]/
│           └── route.ts          # Auth0 API route handler
├── [locale]/
│   ├── (root)/
│   │   ├── signin/
│   │   │   └── page.tsx          # Sign in page
│   │   └── signup/
│   │       └── page.tsx          # Sign up page
│   └── (auth)/
│       └── chat/
│           └── page.tsx          # Protected chat page

lib/
└── auth0.ts                       # Auth0 client configuration

proxy.ts                           # Middleware for route protection

components/
└── layouts/
    └── header.tsx                 # Header with auth UI
```

---

## 🔨 Implementation Details

### 1. Auth0 Client Setup (`lib/auth0.ts`)

```typescript
import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client();
```

This creates a singleton Auth0 client that automatically reads environment variables.

---

### 2. API Route Handler (`app/api/auth/[auth0]/route.ts`)

```typescript
import { auth0 } from "@/lib/auth0";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ auth0: string }> }
) => {
  const params = await context.params;
  return auth0.handleAuth(req, context);
};
```

**What this does:**

- Creates a dynamic catch-all route at `/api/auth/*`
- Handles all Auth0 authentication flows:
  - `/api/auth/login` - Initiates login
  - `/api/auth/signup` - Initiates signup
  - `/api/auth/callback` - Handles Auth0 callback
  - `/api/auth/logout` - Logs user out
  - `/api/auth/me` - Returns current user

---

### 3. Sign In Page (`app/[locale]/(root)/signin/page.tsx`)

```typescript
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getLocale, getTranslations } from "next-intl/server";

export default async function SignInPage() {
  const locale = await getLocale();
  const t = await getTranslations();

  // Redirect authenticated users to chat
  const session = await auth0.getSession();
  if (session?.user) {
    redirect(`/${locale}/chat`);
  }

  return (
    // Beautiful UI with card, button linking to /api/auth/login
  );
}
```

**Key Features:**

- **Server Component** - Checks authentication on server
- **Auto-Redirect** - Authenticated users go to chat
- **Internationalization** - Uses next-intl for translations
- **Beautiful UI** - shadcn/ui components (Card, Button, icons)
- **Auth0 Link** - Button links to `/api/auth/login`

**Authentication Flow:**

1. User clicks "Sign In with Auth0"
2. Redirects to `/api/auth/login`
3. Auth0 SDK redirects to Auth0 login page
4. User authenticates (email/password, Google, GitHub, etc.)
5. Auth0 redirects back to `/api/auth/callback`
6. Session is created and user is redirected to app

---

### 4. Sign Up Page (`app/[locale]/(root)/signup/page.tsx`)

Same pattern as Sign In page, but links to `/api/auth/signup`.

```typescript
<Link href="/api/auth/signup">
  <Sparkles className="mr-2 h-5 w-5" />
  {t("auth.signup.button")}
</Link>
```

---

### 5. Middleware (`proxy.ts`)

```typescript
import { auth0 } from "./lib/auth0";
import { NextResponse, type NextRequest } from "next/server";

const isProtectedRoute = (pathname: string) => {
  return pathname.match(/^\/[^\/]+\/chat/);
};

const isAuthRoute = (pathname: string) => {
  return pathname.match(/^\/[^\/]+\/(signin|signup)/);
};

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Handle Auth0 callback routes first
  if (pathname.startsWith("/api/auth")) {
    return auth0.middleware(req);
  }

  // Check if user is authenticated
  const session = await auth0.getSession(req);
  const locale = pathname.split("/")[1] || "en";

  // Redirect authenticated users away from signin/signup
  if (isAuthRoute(pathname) && session?.user) {
    return NextResponse.redirect(new URL(`/${locale}/chat`, req.url));
  }

  // Protect chat routes
  if (isProtectedRoute(pathname)) {
    if (!session?.user) {
      return NextResponse.redirect(new URL(`/${locale}/signin`, req.url));
    }
  }

  return intlMiddleware(req);
}
```

**How Middleware Works:**

1. **Auth0 Routes** - Let Auth0 SDK handle `/api/auth/*`
2. **Get Session** - Check if user is authenticated
3. **Auth Route Protection** - If user is logged in and tries to access signin/signup:
   - Redirect to `/chat`
4. **Protected Route** - If user is NOT logged in and tries to access `/chat`:
   - Redirect to `/signin`
5. **Public Routes** - Home page (`/`) is always accessible

**Route Protection Rules:**

| Route     | Not Authenticated | Authenticated |
| --------- | ----------------- | ------------- |
| `/`       | ✅ Access         | ✅ Access     |
| `/signin` | ✅ Access         | ❌ → `/chat`  |
| `/signup` | ✅ Access         | ❌ → `/chat`  |
| `/chat`   | ❌ → `/signin`    | ✅ Access     |

---

### 6. Header Component (`components/layouts/header.tsx`)

```typescript
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Header() {
  const { user, isLoading } = useUser();

  return (
    <header>
      {!isLoading && (
        <>
          {!user ? (
            // Show Sign In / Sign Up buttons
            <>
              <Link href="/signin">Sign In</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          ) : (
            // Show user avatar and logout
            <>
              <Link href="/chat">Chat</Link>
              <DropdownMenu>
                <Avatar>
                  <AvatarImage src={user.picture} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <DropdownMenuItem>
                  <Link href="/api/auth/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenu>
            </>
          )}
        </>
      )}
    </header>
  );
}
```

**Client Component Features:**

- **`useUser()` Hook** - Gets current user from Auth0
- **Loading State** - Show nothing while loading
- **Conditional Rendering**:
  - Not authenticated: Show Sign In / Sign Up buttons
  - Authenticated: Show Chat button and user dropdown
- **User Avatar** - Display user profile picture
- **Logout Link** - Links to `/api/auth/logout`

---

### 7. ENUMs (`lib/enums.ts`)

```typescript
export const ENUMs = {
  PAGES: {
    HOME: "/",
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    CHAT: "/chat",
  },
} as const;
```

**Why ENUMs?**

- Centralized route definitions
- Type safety (TypeScript autocomplete)
- Easy to update routes in one place
- Prevents typos

---

### 8. Translations

**English (`messages/en.json`):**

```json
{
  "header": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "chat": "Chat",
    "logout": "Logout"
  },
  "auth": {
    "signin": {
      "title": "Welcome Back",
      "description": "Sign in to continue your AI conversations",
      "button": "Sign In with Auth0"
    }
  }
}
```

**Arabic and Kurdish** translations follow the same structure.

---

## 🔄 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Journey                            │
└─────────────────────────────────────────────────────────────┘

1. User visits /signin
   ↓
2. Page checks if user is authenticated (Server Component)
   ├─ Yes → Redirect to /chat
   └─ No → Show sign in page
       ↓
3. User clicks "Sign In with Auth0"
   ↓
4. Browser navigates to /api/auth/login
   ↓
5. Auth0 SDK redirects to Auth0 login page
   ↓
6. User enters credentials (or uses social login)
   ↓
7. Auth0 redirects back to /api/auth/callback
   ↓
8. Auth0 SDK creates encrypted session cookie
   ↓
9. User is redirected to /chat (or returnTo URL)
   ↓
10. Middleware checks session → Allows access
    ↓
11. Header shows user avatar and logout button
```

---

## 🛡️ Security Features

### 1. **Encrypted Sessions**

- Sessions are stored in encrypted cookies
- Uses `AUTH0_SECRET` for encryption
- No sensitive data in localStorage or client-side state

### 2. **CSRF Protection**

- Auth0 SDK handles CSRF tokens automatically
- State parameter prevents CSRF attacks

### 3. **Secure Cookies**

- HttpOnly cookies (not accessible via JavaScript)
- SameSite=Lax (prevents CSRF)
- Secure flag in production (HTTPS only)

### 4. **Token Validation**

- ID tokens are validated automatically
- Signature verification using JWKS
- Expiration checking

---

## 🎨 UI Components Used

From **shadcn/ui**:

- `Card` - Container for signin/signup forms
- `Button` - CTA buttons
- `Avatar` - User profile picture
- `DropdownMenu` - User menu
- Icons from **Lucide React**: `LogIn`, `Sparkles`, `MessageSquare`, `LogOut`

---

## 🌍 Internationalization

All auth pages support 3 languages:

- **English** (`en`)
- **Arabic** (`ar`) - RTL support
- **Kurdish Central** (`ckb`) - RTL support

Translations managed via **next-intl**.

---

## 🧪 Testing the Implementation

### 1. **Start the Development Server**

```bash
bun run dev
```

### 2. **Test Public Access**

- Visit `http://localhost:3000` → ✅ Should work
- Visit `http://localhost:3000/en/signin` → ✅ Should show signin page

### 3. **Test Authentication**

- Click "Sign In with Auth0" → Should redirect to Auth0
- Sign in with your account
- Should redirect back to `/chat`

### 4. **Test Protected Routes**

- Visit `/chat` without logging in → Should redirect to `/signin`
- Visit `/chat` after logging in → ✅ Should work

### 5. **Test Authenticated Redirects**

- Log in
- Visit `/signin` → Should redirect to `/chat`
- Visit `/signup` → Should redirect to `/chat`

### 6. **Test Logout**

- Click user avatar → Click "Logout"
- Should log out and redirect to home

---

## 📝 Common Issues & Solutions

### Issue 1: "Invalid state" error

**Cause:** Cookie issues or session mismatch
**Solution:**

- Clear browser cookies
- Check `AUTH0_SECRET` is set
- Ensure `AUTH0_BASE_URL` matches your app URL

### Issue 2: "Callback URL mismatch"

**Cause:** Auth0 app not configured correctly
**Solution:**

- Go to Auth0 Dashboard → Applications → Your App
- Add to Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
- Add to Allowed Logout URLs: `http://localhost:3000`

### Issue 3: User data not showing

**Cause:** Session not created or expired
**Solution:**

- Check if cookies are being set (DevTools → Application → Cookies)
- Verify `AUTH0_ISSUER_BASE_URL` is correct
- Try logging out and back in

---

## 🚀 Production Deployment

### 1. Update Environment Variables

```env
AUTH0_BASE_URL=https://yourdomain.com
AUTH0_SECRET=<generate-new-secret>
```

### 2. Update Auth0 Dashboard

- Allowed Callback URLs: `https://yourdomain.com/api/auth/callback`
- Allowed Logout URLs: `https://yourdomain.com`
- Allowed Web Origins: `https://yourdomain.com`

### 3. Enable HTTPS

- Cookies will have `Secure` flag automatically in production
- Make sure your domain has SSL certificate

---

## 📚 Additional Resources

- **Auth0 Next.js SDK:** https://auth0.com/docs/quickstart/webapp/nextjs
- **Auth0 Dashboard:** https://manage.auth0.com
- **Next.js App Router:** https://nextjs.org/docs/app
- **shadcn/ui:** https://ui.shadcn.com

---

## ✅ Summary

We successfully implemented:

✅ Full Auth0 authentication flow
✅ Protected routes with middleware
✅ Auto-redirect logic for authenticated users
✅ Beautiful signin/signup pages
✅ User profile display in header
✅ Multi-language support
✅ Security best practices
✅ Type-safe route constants

The implementation follows all AGENTS.md guidelines:

- Uses only approved libraries
- Server Components for data fetching
- shadcn/ui for all UI components
- next-intl for translations
- Proper folder structure
- TypeScript throughout

---

**Created by:** AI Assistant  
**Date:** January 27, 2026  
**Version:** 1.0
