# 🔄 Data Fetching & Error Handling Architecture

This document explains how data fetching, React Query, and error handling work together in this Next.js project, with a focus on **Server Actions** and proper error management in production.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [The Three-Layer System](#the-three-layer-system)
- [Error Handling Pattern](#error-handling-pattern)
- [Why Server Actions Can't Throw Errors](#why-server-actions-cant-throw-errors)
- [Step-by-Step Flow](#step-by-step-flow)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)

---

## 🏗️ Architecture Overview

Our data fetching architecture uses **Next.js Server Actions** combined with **React Query** for optimal performance and error handling:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Query Mutations (queries/*.ts)                │   │
│  │  - Calls Server Actions                              │   │
│  │  - Throws errors using throwIfError()                │   │
│  │  - Triggers onError/onSuccess handlers               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    SERVER SIDE                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Actions (actions/*.ts)                       │   │
│  │  - "use server" functions                            │   │
│  │  - Returns plain objects (serializable)              │   │
│  │  - Returns error objects with __isError flag         │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ↕                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Config (config/api.config.ts)                   │   │
│  │  - Fetch wrapper functions                           │   │
│  │  - Cookie management                                 │   │
│  │  - Returns error objects instead of throwing         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND API                                  │
│  - NestJS REST API                                           │
│  - Returns error responses with status codes                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 The Three-Layer System

### **Layer 1: API Config** (`lib/config/api.config.ts`)

Server-side fetch wrappers that communicate with the backend API.

**Key Features:**

- `"use server"` directive - runs on the server only
- Handles cookies for authentication
- Manages headers (JWT tokens, language)
- **Returns error objects** instead of throwing

```typescript
export async function post<T>(path: string, data?: any): Promise<T> {
  const response = await fetch(`${baseURL}${path}`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
      statusCode: response.status,
    }));
    // ✅ Return error object (serializable)
    return {
      __isError: true,
      ...error,
      statusCode: error.statusCode || response.status,
    } as any;
  }

  return response.json();
}
```

### **Layer 2: Server Actions** (`lib/react-query/actions/*.ts`)

Business logic functions that can be called from client components.

**Key Features:**

- `"use server"` directive
- Handles authentication checks
- Processes API responses
- **Returns error objects** when errors occur

```typescript
export const login = async (form: LoginSchema) => {
  try {
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged && (alreadyLogged as any).__isError) return alreadyLogged;

    const data = await post(URLs.LOGIN, form);
    if (data && (data as any).__isError) return data; // ✅ Return error object

    await saveJWT(data.jwt);
    await signIn("credentials", {
      /* ... */
    });
    return form;
  } catch (error: any) {
    return handleServerError(error); // ✅ Return error object
  }
};
```

### **Layer 3: React Query Mutations** (`lib/react-query/queries/*.ts`)

Client-side hooks that manage UI state and trigger Server Actions.

**Key Features:**

- `"use client"` directive
- Calls Server Actions
- **Throws errors on client side** using `throwIfError()`
- Handles success/error with toast notifications

```typescript
export const useLogin = () => {
  const t = useTranslations();

  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      await loginMiddleware(i18n, data); // Validate first
      const result = await login(data); // Call Server Action
      return throwIfError(result); // ✅ Throw if error (CLIENT SIDE)
    },
    onSuccess: () => {
      toast.success(t("messages.loginSuccess"));
    },
    onError: (error) => {
      handleMutationError(error, t, "errors.login", (msg) => toast.error(msg));
    },
  });
};
```

---

## 🚫 Why Server Actions Can't Throw Errors

### **The Problem**

In Next.js, Server Actions (`"use server"`) can only pass **serializable data** between server and client:

**❌ NOT Serializable:**

- Error instances (`new Error()`, `new ApiError()`)
- Functions, classes, symbols
- Circular references

**✅ Serializable:**

- Plain objects `{}`
- Arrays `[]`
- Primitives (string, number, boolean)
- Dates (converted to strings)

### **What Happens in Production**

When you throw an Error in a Server Action:

```typescript
// ❌ BAD - Doesn't work in production
export const login = async (form: LoginSchema) => {
  throw new Error("Login failed"); // Error instance can't be serialized!
};
```

**Result in Production:**

```
Error: An error occurred in the Server Components render.
The specific message is omitted in production builds to avoid leaking sensitive details.
A digest property is included...
```

The actual error message is stripped for security!

---

## 🎯 Error Handling Pattern

### **The Solution: Error Object with `__isError` Flag**

We use a special flag to mark objects as errors:

```typescript
// Error object structure
{
  __isError: true,        // Marks this as an error
  statusCode: 401,        // HTTP status code
  message: "Unauthorized", // Error message
  details?: [],           // Optional: Multiple error messages
  fields?: [],            // Optional: Validation errors per field
}
```

### **Error Flow**

```
1. Backend returns error
   { statusCode: 401, message: "Unauthorized" }
           ↓
2. api.config catches it
   Returns { __isError: true, statusCode: 401, message: "Unauthorized" }
           ↓
3. Server Action receives it
   Checks for __isError, returns error object (serializable)
           ↓
4. React Query receives it
   Calls throwIfError() which converts to Error instance
           ↓
5. Error instance thrown (CLIENT SIDE)
   onError handler executes
           ↓
6. Toast notification shows
   toast.error("Unauthorized") ✅
```

---

## 📝 Step-by-Step Flow

### **1. User Submits Form**

```tsx
<form onSubmit={loginMutation.mutate(formData)}>
```

### **2. React Query Calls Server Action**

```typescript
mutationFn: async (data: LoginSchema) => {
  await loginMiddleware(i18n, data); // Validate on client first
  const result = await login(data); // Call Server Action
  return throwIfError(result); // Check for errors
};
```

### **3. Server Action Processes Request**

```typescript
export const login = async (form: LoginSchema) => {
  // Check if already logged in
  const alreadyLogged = await alreadyLoggedIn();
  if (alreadyLogged?.__isError) return alreadyLogged;

  // Make API call
  const data = await post(URLs.LOGIN, form);
  if (data?.__isError) return data; // Return error if present

  // Success - save JWT and sign in
  await saveJWT(data.jwt);
  await signIn("credentials", {
    /* ... */
  });
  return form;
};
```

### **4. API Config Makes Request**

```typescript
const response = await fetch(`${baseURL}/auth/login`, {
  method: "POST",
  body: JSON.stringify(form),
});

if (!response.ok) {
  const error = await response.json();
  return { __isError: true, ...error, statusCode: response.status };
}

return response.json();
```

### **5. Error Object Returns to Client**

```typescript
// Result has __isError flag
{ __isError: true, statusCode: 401, message: "Invalid credentials" }
```

### **6. throwIfError() Converts to Error**

```typescript
export function throwIfError<T>(data: T): T {
  if (data && typeof data === "object" && (data as any).__isError) {
    throw new ApiError(data as any); // ✅ Throw on CLIENT side
  }
  return data;
}
```

### **7. onError Handler Executes**

```typescript
onError: (error: ApiError) => {
  // error.message = "Invalid credentials"
  handleMutationError(error, t, "errors.login", (msg) => toast.error(msg));
};
```

---

## 💻 Code Examples

### **Complete Login Example**

**Server Action** (`actions/auth.action.ts`):

```typescript
"use server";

export const login = async (form: LoginSchema) => {
  try {
    // Check authorization
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged?.__isError) return alreadyLogged;

    // API call
    const data = await post(URLs.LOGIN, form);
    if (data?.__isError) return data;

    // Success flow
    await saveJWT(data.jwt);
    await signIn("credentials", {
      id: data.user.id.toString(),
      email: data.user.email,
      jwt: data.jwt,
      redirect: false,
    });

    return form;
  } catch (error: any) {
    return handleServerError(error);
  }
};
```

**React Query Hook** (`queries/auth.query.ts`):

```typescript
"use client";

export const useLogin = () => {
  const t = useTranslations();
  const router = useRouter();
  const { update } = useSession();

  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      await loginMiddleware(i18n, data);
      const result = await login(data);
      return throwIfError(result);
    },
    onSuccess: async () => {
      await update();
      toast.success(t("messages.loginSuccess"));
      router.push(ENUMs.PAGES.PROFILE);
    },
    onError: (error: any, variables) => {
      if (error.message === "ACCOUNT_NOT_VERIFIED") {
        toast.info(t("messages.accountNotVerified"));
        router.push(`/authentication?email=${variables.email}`);
        return;
      }
      handleMutationError(error, t, "errors.login", (msg) => toast.error(msg));
    },
  });
};
```

### **Validation Errors Example**

**Backend Returns:**

```json
{
  "statusCode": 422,
  "message": [
    {
      "field": "email",
      "messages": ["errors.invalidEmail"]
    },
    {
      "field": "password",
      "messages": ["errors.passwordTooShort", "errors.passwordNoNumber"]
    }
  ]
}
```

**handleServerError Processes:**

```typescript
export function handleServerError(error: unknown): SerializableError {
  if (statusCode === 422 && Array.isArray(message) && message[0]?.field) {
    const validationErrors = message as Array<{
      field: string;
      messages: string[];
    }>;
    return {
      __isError: true,
      statusCode,
      message: validationErrors[0].messages[0],
      fields: validationErrors,
      details: validationErrors.flatMap((e) => e.messages),
    } as any;
  }
  // ... other cases
}
```

**handleMutationError Shows:**

```typescript
export function handleMutationError(
  error: any,
  t: any,
  fallbackKey: string,
  onError: (msg: string) => void
) {
  if (error.fields?.length) {
    error.fields.forEach((f: { field: string; messages: string[] }) => {
      f.messages.forEach((msg) => {
        const translated = t(msg) || msg;
        onError(`${f.field}: ${translated}`);
      });
    });
    return;
  }
  // ... fallback
}
```

**Result:**

```
toast.error("email: Invalid email address")
toast.error("password: Password is too short")
toast.error("password: Password must contain a number")
```

---

## ✅ Best Practices

### **1. Always Check for `__isError`**

In Server Actions, check every async call:

```typescript
// ✅ GOOD
const result = await someAction();
if (result?.__isError) return result;

// ❌ BAD - errors might not propagate
const result = await someAction();
```

### **2. Use throwIfError in Mutations**

Always throw errors on the client side:

```typescript
// ✅ GOOD
mutationFn: async (data) => {
  const result = await serverAction(data);
  return throwIfError(result);
};

// ❌ BAD - errors won't trigger onError
mutationFn: async (data) => {
  return await serverAction(data);
};
```

### **3. Handle Specific Error Cases**

Check for special error messages before generic handling:

```typescript
onError: (error, variables) => {
  // Special cases first
  if (error.message === "ACCOUNT_NOT_VERIFIED") {
    toast.info(t("messages.accountNotVerified"));
    router.push(`/verify?email=${variables.email}`);
    return;
  }

  if (error.message === "TWO_FACTOR_REQUIRED") {
    // Show 2FA modal
    return;
  }

  // Generic error handling last
  handleMutationError(error, t, "errors.default", (msg) => toast.error(msg));
};
```

### **4. Return Serializable Objects**

Never throw in Server Actions:

```typescript
// ✅ GOOD
export const someAction = async () => {
  try {
    const data = await apiCall();
    if (data?.__isError) return data;
    return data;
  } catch (error) {
    return handleServerError(error); // Returns object
  }
};

// ❌ BAD
export const someAction = async () => {
  try {
    return await apiCall();
  } catch (error) {
    throw new Error("Failed"); // Can't serialize!
  }
};
```

### **5. Use Middleware for Validation**

Validate on client before calling Server Actions:

```typescript
mutationFn: async (data) => {
  await loginMiddleware(i18n, data); // Validates and shows errors early
  const result = await login(data);
  return throwIfError(result);
};
```

---

## 🚨 Common Pitfalls

### **Pitfall 1: Throwing Errors in Server Actions**

```typescript
// ❌ WRONG
export const login = async (form: LoginSchema) => {
  throw new Error("Failed"); // Won't work in production!
};

// ✅ CORRECT
export const login = async (form: LoginSchema) => {
  return handleServerError({ message: "Failed", statusCode: 500 });
};
```

### **Pitfall 2: Not Checking for Errors**

```typescript
// ❌ WRONG - Error might not propagate
export const updateProfile = async (data) => {
  const user = await getUser();
  const result = await updateUser(user.id, data);
  return result;
};

// ✅ CORRECT - Check each step
export const updateProfile = async (data) => {
  const user = await getUser();
  if (user?.__isError) return user;

  const result = await updateUser(user.id, data);
  if (result?.__isError) return result;

  return result;
};
```

### **Pitfall 3: Forgetting throwIfError**

```typescript
// ❌ WRONG - onError won't trigger
mutationFn: async (data) => {
  return await login(data);
};

// ✅ CORRECT - Error gets thrown
mutationFn: async (data) => {
  const result = await login(data);
  return throwIfError(result);
};
```

### **Pitfall 4: Using try-catch in Mutations**

```typescript
// ❌ WRONG - Catches errors that should trigger onError
mutationFn: async (data) => {
  try {
    const result = await login(data);
    return throwIfError(result);
  } catch (error) {
    console.error(error);
    return null; // onError won't run!
  }
};

// ✅ CORRECT - Let errors propagate
mutationFn: async (data) => {
  const result = await login(data);
  return throwIfError(result);
};
```

---

## 🎓 Summary

**Key Takeaways:**

1. ✅ Server Actions return **plain objects**, never throw
2. ✅ Use `__isError: true` flag to mark errors
3. ✅ Always check for `__isError` in Server Actions
4. ✅ Use `throwIfError()` in React Query mutations
5. ✅ Handle errors with `onError` and show toasts
6. ✅ Validate early with middleware
7. ✅ Special error cases before generic handling

**The Pattern:**

```
Server Action → Returns error object → React Query → throwIfError() → onError → Toast
```

This architecture ensures:

- ✅ Errors work in production
- ✅ Type-safe error handling
- ✅ Proper error messages displayed
- ✅ Security (no leaked server details)
- ✅ Great user experience

---

## 📚 Related Documentation

- [Authentication](./authentication.md)
- [Cookie Management](./cookie-management.md)
- [Internationalization](./internationalization.md)
- [Backend Token Setup](./backend-token-setup.md)
