# 🔐 Authentication

This document outlines the authentication architecture and standards for the **AI Chat** project using **Auth0**.

---

## 🚨 CRITICAL: Authentication Library

- **ONLY use Auth0** for authentication
- **DO NOT use** other authentication libraries (Clerk, NextAuth.js, Auth.js, Supabase Auth, Firebase Auth, etc.)
- **DO NOT** implement custom JWT/session management

---

## 📁 File Structure

```
project/
├── lib/
│   └── auth0.ts                      # Auth0 configuration
├── app/
│   ├── [locale]/
│   │   └── (auth)/
│   │       ├── login/
│   │       │   └── page.tsx          # Login page
│   │       ├── signup/
│   │       │   └── page.tsx          # Sign-up page
│   │       └── callback/
│   │           └── page.tsx          # Auth0 callback handler
│   └── layout.tsx                    # Root layout
└── .env                              # Environment variables
```

---

## 🔧 Core Configuration

### 1️⃣ Environment Variables (`.env`)

**Required Setup:**

```env
# Auth0 Authentication
AUTH0_SECRET=your-secret-key
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
```

**Key Rules:**

- ✅ Get credentials from [Auth0 Dashboard](https://manage.auth0.com)
- ✅ Use environment variables for all Auth0 configuration
- ❌ DO NOT hardcode API keys in code
- ❌ DO NOT commit `.env` file to git

### 2️⃣ Auth0 SDK Setup

**Location:** `/lib/auth0.ts`

**Required Setup:**

```typescript
import { initAuth0 } from "@auth0/nextjs-auth0";

export default initAuth0({
  secret: process.env.AUTH0_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
});
```

    return NextResponse.redirect(new URL("/dashboard", req.url));

}

// Handle admin route protection
if (isProtectedRoute(req)) {
if (!userId) {
await auth.protect();
return;
}
}

return nextIntlMiddleware(req);
});

export const config = {
matcher: [
"/((?!_next|.*\\..*).*)", // Skip all static files
"/api/:path*", // API routes
],
};

````

**Key Rules:**

- ✅ Use `clerkMiddleware` for route protection
- ✅ Use `createRouteMatcher` to define public/protected routes
- ✅ Combine with `next-intl` middleware for i18n support
- ✅ Redirect authenticated users away from auth pages
- ❌ DO NOT use Next.js middleware without Clerk integration
- ❌ DO NOT hardcode protected routes - use matchers

---

## 🎨 Authentication UI

### 1️⃣ Sign-In Page (`app/[locale]/(auth)/sign-in/[[...sign-in]]/page.tsx`)

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
````

### 2️⃣ Sign-Up Page (`app/[locale]/(auth)/sign-up/[[...sign-up]]/page.tsx`)

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
```

**Key Rules:**

- ✅ Use Clerk's pre-built components (`<SignIn />`, `<SignUp />`)
- ✅ Customize appearance via Clerk Dashboard or appearance prop
- ❌ DO NOT create custom auth forms (use Clerk components)
- ❌ DO NOT implement password validation manually

---

## 🔒 Protected Routes

### Server Components

```tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1>Hello {user?.firstName}!</h1>
      <p>Email: {user?.emailAddresses[0].emailAddress}</p>
    </div>
  );
}
```

### Client Components

```tsx
"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <SignedOut>
        <Link href="/sign-in">Sign In</Link>
        <Link href="/sign-up">Sign Up</Link>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
```

**Key Rules:**

- ✅ Use `auth()` and `currentUser()` in Server Components
- ✅ Use `<SignedIn>`, `<SignedOut>` in Client Components
- ✅ Use `<UserButton />` for user menu
- ❌ DO NOT use `useSession()` (NextAuth pattern)
- ❌ DO NOT implement custom session management

---

## 🌐 Multi-Language Support

### Clerk Localization

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { arSA, enUS } from "@clerk/localizations";

export default function RootLayout({ children, params: { locale } }) {
  return (
    <ClerkProvider
      localization={
        locale === "ar" ? arSA : locale === "en" ? enUS : undefined
      }>
      {children}
    </ClerkProvider>
  );
}
```

**Available Localizations:**

- English: `enUS`
- Arabic: `arSA`
- Kurdish: Not available (defaults to English)

**Key Rules:**

- ✅ Import localizations from `@clerk/localizations`
- ✅ Pass `localization` prop to `<ClerkProvider>`
- ❌ DO NOT create custom translations for Clerk UI

---

## 🎨 Customizing Clerk UI

### Appearance Customization

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--background))",
        },
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          card: "bg-card",
        },
      }}>
      {children}
    </ClerkProvider>
  );
}
```

**Key Rules:**

- ✅ Use `appearance` prop for theme customization
- ✅ Match your app's color scheme
- ✅ Use CSS variables for consistency
- ❌ DO NOT override core Clerk functionality

---

## 📊 User Data Access

### Get Current User (Server)

```tsx
import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const user = await currentUser();

  return (
    <div>
      <p>ID: {user?.id}</p>
      <p>Email: {user?.emailAddresses[0].emailAddress}</p>
      <p>
        Name: {user?.firstName} {user?.lastName}
      </p>
      <p>Image: {user?.imageUrl}</p>
    </div>
  );
}
```

### Get User ID (Server)

```tsx
import { auth } from "@clerk/nextjs/server";

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Use userId for database queries
  const expenses = await db.expense.findMany({
    where: { userId },
  });

  return <div>Your expenses</div>;
}
```

### Get User (Client)

```tsx
"use client";
import { useUser } from "@clerk/nextjs";

export default function ProfileCard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <p>{user?.firstName}</p>
      <img src={user?.imageUrl} alt="Profile" />
    </div>
  );
}
```

**Key Rules:**

- ✅ Use `currentUser()` for full user object in Server Components
- ✅ Use `auth()` for just userId in Server Components
- ✅ Use `useUser()` hook in Client Components
- ❌ DO NOT mix server and client patterns

---

## 🔑 Best Practices

### ✅ DO:

1. **Use Clerk's pre-built components** - They're secure and tested
2. **Protect routes with middleware** - Define in `proxy.ts`
3. **Use Server Components for auth** - Better performance
4. **Customize appearance** - Match your brand
5. **Handle loading states** - Check `isLoaded` in client components

### ❌ DON'T:

1. **Don't create custom auth forms** - Use Clerk components
2. **Don't store passwords** - Clerk handles all credentials
3. **Don't implement JWT manually** - Clerk manages sessions
4. **Don't bypass Clerk middleware** - Always use proper auth checks
5. **Don't hardcode redirect URLs** - Use environment variables

---

## 🚨 Security Checklist

Before deploying:

- [ ] Environment variables are set correctly
- [ ] Protected routes are defined in `proxy.ts`
- [ ] Sign-in/sign-up redirects work properly
- [ ] User data is fetched securely (server-side)
- [ ] Clerk middleware is configured correctly
- [ ] No sensitive data in client components
- [ ] Appearance matches your brand
- [ ] Multi-language support is working

---

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Customization Guide](https://clerk.com/docs/components/customization/overview)
- [Middleware Guide](https://clerk.com/docs/references/nextjs/clerk-middleware)

---

**Remember:** Clerk handles all authentication complexity. Focus on your app's features, not auth implementation.
