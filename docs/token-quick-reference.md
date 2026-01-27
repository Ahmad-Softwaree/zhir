# 🚀 Backend Token - Quick Reference

## Token Access Cheat Sheet

```tsx
// ==========================================
// SERVER COMPONENTS - Get token
// ==========================================
import { auth } from "@/auth";

const session = await auth();
const token = session?.jwt;

// ==========================================
// CLIENT COMPONENTS - Get token
// ==========================================
import { useSession } from "next-auth/react";

const { data: session } = useSession();
const token = session?.jwt;

// ==========================================
// EASIEST WAY - Use authApi (RECOMMENDED!)
// ==========================================
import { authApi } from "@/lib/config/api.config";

// Token automatically included in all requests
await authApi.get("/users/me");
await authApi.post("/items", data);
await authApi.put("/users/1", data);
await authApi.delete("/items/1");

// ==========================================
// HELPER FUNCTIONS
// ==========================================
import { getBackendToken, isAuthenticated } from "@/lib/helpers/token";

const token = await getBackendToken();
const authenticated = await isAuthenticated();
```

## Where is the Token?

| Location         | Property                 | Example                                   |
| ---------------- | ------------------------ | ----------------------------------------- |
| Session (Server) | `session.jwt`            | `const session = await auth();`           |
| Session (Client) | `session.jwt`            | `const { data: session } = useSession();` |
| Cookie           | Auto-attached by authApi | `await authApi.get("/endpoint");`         |

## Most Common Patterns

### ✅ Making API Calls (Recommended)

```tsx
import { authApi } from "@/lib/config/api.config";

// Token automatically included!
const { data } = await authApi.get("/users/me");
```

### Server Action

```tsx
"use server";
import { auth } from "@/auth";

export async function myAction() {
  const session = await auth();
  if (!session?.jwt) throw new Error("Unauthorized");
  // Use session.jwt
}
```

### Protected Server Component

```tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.jwt) redirect("/login");
  // Component code
}
```

### Protected Client Component

```tsx
"use client";
import { useSession } from "next-auth/react";

export function Component() {
  const { data: session, status } = useSession();
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;
  // Component code - use session.jwt
}
```

## TypeScript

```tsx
import type { Session } from "next-auth";

// ✅ Full type safety
const session: Session | null = await auth();
const token: string = session.jwt; // Typed!

// ✅ In components
const { data: session } = useSession();
const token: string | undefined = session?.jwt; // Typed!
```

## Remember

- ✅ **Use `authApi`** - Token auto-included (easiest!)
- ✅ **Server**: `const session = await auth()`
- ✅ **Client**: `const { data: session } = useSession()`
- ✅ Token stored in: Session, JWT, and Cookie
- ✅ Full TypeScript support
- ❌ Never log token in production
- ❌ Always use HTTPS in production

## Files Created

- ✅ `next-auth.d.ts` - Type definitions
- ✅ `lib/helpers/token.ts` - Helper functions
- ✅ `docs/BACKEND-TOKEN-SETUP.md` - Setup summary
- ✅ `docs/backend-token-usage.md` - Full documentation
- ✅ `docs/token-usage-examples.tsx` - Code examples

---

**Bottom Line**: Just use `authApi` for all your API calls - the token is automatically included! 🎉
