# 🔄 Data Fetching & Error Handling Architecture

This document explains how data fetching and error handling work together in this Next.js project, with a focus on **Server Actions**, **Zustand**, and proper error management in production.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [The Three-Layer System](#the-three-layer-system)
- [Error Handling Pattern](#error-handling-pattern)
- [Why Server Actions Can't Throw Errors](#why-server-actions-cant-throw-errors)
- [Chat Streaming with Zustand](#chat-streaming-with-zustand)
- [Step-by-Step Flow](#step-by-step-flow)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)

---

## 🏗️ Architecture Overview

Our data fetching architecture uses **Next.js Server Actions** combined with **Zustand** for client-side streaming state:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Client Components                                    │   │
│  │  - Calls Server Actions directly                     │   │
│  │  - Handles error objects with __isError flag         │   │
│  │  - Shows toast notifications for errors              │   │
│  │  - Uses Zustand for streaming UI state               │   │
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
│                 BACKEND API / MONGODB                        │
│  - REST API endpoints or Direct MongoDB access              │
│  - Returns data or error responses                          │
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

### **Layer 2: Server Actions** (`lib/actions/*.ts`)

Business logic functions that can be called from client components.

**Key Features:**

- `"use server"` directive
- Handles authentication checks (via Auth0 session)
- Processes API responses or MongoDB operations
- **Returns error objects** when errors occur

```typescript
"use server";

export async function getAllChats() {
  try {
    let data = await get(URLs.GET_ALL_CHATS, { tags: [ENUMs.TAGS.CHATS] });
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}

export async function createNewChat() {
  try {
    let data = await post(URLs.CREATE_NEW_CHAT, {});
    if (data && !(data as any).__isError) {
      revalidatePath(ENUMs.TAGS.CHATS);
    }
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}
```

### **Layer 3: Client Components**

Client-side components that call Server Actions and handle UI state.

**Key Features:**

- `"use client"` directive (when needed)
- Calls Server Actions directly
- **Checks for `__isError` flag** in responses
- Shows toast notifications for errors/success
- Can use Zustand for local state

```typescript
"use client";

export function ChatList() {
  const handleDelete = async (id: string) => {
    const result = await deleteChat(id);

    if (result && (result as any).__isError) {
      toast.error(result.message);
      return;
    }

    toast.success("Chat deleted!");
  };

  return <Button onClick={() => handleDelete(chatId)}>Delete</Button>;
}
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
1. Backend/MongoDB returns error
   { statusCode: 401, message: "Unauthorized" }
           ↓
2. api.config catches it
   Returns { __isError: true, statusCode: 401, message: "Unauthorized" }
           ↓
3. Server Action receives it
   Checks for __isError, returns error object (serializable)
           ↓
4. Client Component receives it
   Checks for __isError flag
           ↓
5. Toast notification shows
   toast.error("Unauthorized") ✅
```

---

## 💬 Chat Streaming with Zustand

This project uses OpenAI's streaming API for real-time chat responses. State management for streaming is handled by **Zustand**.

### **Streaming Architecture**

```
User Input → ChatInput.tsx → sendChat() → /api/openai
                                              ↓
                                    OpenAI Streaming API
                                              ↓
                                    Transform Stream
                                              ↓
                                  Zustand Store (chunks)
                                              ↓
                                    ChatMessages.tsx
                                              ↓
                                    Save to MongoDB
```

### **Zustand Store for Streaming**

```typescript
// lib/store/chat.store.ts
interface ChatStore {
  currentUserMessage: string;
  currentAiResponse: string;
  isStreaming: boolean;

  setUserMessage: (message: string) => void;
  appendToResponse: (chunk: string) => void;
  setStreaming: (streaming: boolean) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentUserMessage: "",
  currentAiResponse: "",
  isStreaming: false,

  setUserMessage: (message: string) => {
    set({
      currentUserMessage: message,
      currentAiResponse: "",
      isStreaming: true,
    });
  },

  appendToResponse: (chunk: string) => {
    set((state) => ({
      currentAiResponse: state.currentAiResponse + chunk,
    }));
  },

  setStreaming: (streaming: boolean) => {
    set({ isStreaming: streaming });
  },

  resetChat: () => {
    set({
      currentUserMessage: "",
      currentAiResponse: "",
      isStreaming: false,
    });
  },
}));
```

### **Client-Side Streaming Function**

```typescript
// lib/actions/chat.action.ts
export const sendChat = async (
  message: string,
  chatId: string | undefined,
  onChunk?: (text: string) => void,
  onComplete?: () => void
) => {
  const response = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, chatId }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    onChunk?.(chunk); // Update Zustand store
  }

  onComplete?.(); // Reset streaming state
};
```

### **OpenAI Streaming API Route**

```typescript
// app/api/openai/route.ts
export async function POST(request: NextRequest) {
  const session = await auth0.getSession(request);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { message, chatId } = await request.json();
  const userId = session.user.sub;

  const stream = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are Zhir AI assistant..." },
      { role: "user", content: message },
    ],
    stream: true,
  });

  let fullResponse = "";

  const customStream = new TransformStream({
    async transform(chunk, controller) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        controller.enqueue(encoder.encode(content));
      }
    },
  });

  // Stream to client while saving to MongoDB
  return new Response(stream.toReadableStream().pipeThrough(customStream), {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

### **Using Streaming in Components**

```typescript
// components/chat/ChatInput.tsx
const ChatInput = () => {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const { setUserMessage, appendToResponse, setStreaming, resetChat } =
    useChatStore();

  const handleSubmit = async () => {
    const userMessage = input.trim();
    setInput("");
    setUserMessage(userMessage); // Set user message in Zustand

    await sendChat(
      userMessage,
      id ? String(id) : undefined,
      (chunk) => {
        appendToResponse(chunk); // Append each chunk to AI response
      },
      () => {
        setStreaming(false); // Mark streaming as complete
        resetChat(); // Clear streaming state
      }
    );
  };

  return <Textarea value={input} onChange={(e) => setInput(e.target.value)} />;
};
```

---

## 📝 Step-by-Step Flow

### **1. User Submits Chat Message**

```tsx
<ChatInput onSubmit={handleSubmit} />
```

### **2. Client Component Calls Streaming Function**

```typescript
const handleSubmit = async () => {
  setUserMessage(message); // Update Zustand

  await sendChat(
    message,
    chatId,
    (chunk) => appendToResponse(chunk), // Stream chunks to Zustand
    () => setStreaming(false) // Complete
  );
};
```

### **3. API Route Streams from OpenAI**

```typescript
const stream = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: message }],
  stream: true,
});

return new Response(stream.toReadableStream());
```

### **4. Component Receives Chunks**

```typescript
while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  appendToResponse(chunk); // Update UI in real-time
}
```

### **5. Save to MongoDB After Completion**

```typescript
await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({
    chatId,
    userMessage: message,
    aiResponse: fullResponse,
  }),
});
```

body: JSON.stringify(form),
});

if (!response.ok) {
const error = await response.json();
return { \_\_isError: true, ...error, statusCode: response.status };
}

return response.json();

````

### **5. Error Object Returns to Client**

```typescript
// Result has __isError flag
{ __isError: true, statusCode: 401, message: "Invalid credentials" }
````

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

### **2. Handle Errors in Client Components**

Always check for error objects when calling Server Actions:

```typescript
// ✅ GOOD
const handleSubmit = async (data) => {
  const result = await createChat(data);
  if (result?.__isError) {
    toast.error(result.message);
    return;
  }
  toast.success("Chat created!");
};

// ❌ BAD - errors won't show to user
const handleSubmit = async (data) => {
  const result = await createChat(data);
  toast.success("Chat created!");
};
```

### **3. Use Zustand for Streaming State**

For real-time updates (like AI streaming), use Zustand:

```typescript
// ✅ GOOD - Zustand store for streaming
const useChatStore = create<ChatStore>((set) => ({
  currentAiResponse: "",
  appendToResponse: (chunk: string) => {
    set((state) => ({
      currentAiResponse: state.currentAiResponse + chunk,
    }));
  },
}));

// ❌ BAD - useState causes too many re-renders
const [response, setResponse] = useState("");
setResponse((prev) => prev + chunk); // Re-renders entire component
```

### **4. Return Error Objects, Never Throw**

In Server Actions, always return error objects:

```typescript
// ✅ GOOD
"use server";
export async function createChat(data) {
  try {
    const result = await post(URLs.CREATE_CHAT, data);
    if (result?.__isError) return result;
    return result;
  } catch (error) {
    return handleServerError(error);
  }
}

// ❌ BAD - throws won't serialize
("use server");
export async function createChat(data) {
  const result = await post(URLs.CREATE_CHAT, data);
  if (!result.success) {
    throw new Error("Failed"); // ❌ Won't work in production
  }
  return result;
}
```

### **5. Use Server Components for Initial Data**

Fetch data in Server Components when possible:

```typescript
// ✅ GOOD - Server Component
export default async function ChatPage({ params }) {
  const { id } = await params;
  const chat = await getChat(id); // Direct Server Action call

  return <ChatMessages data={chat} />;
}

// ❌ BAD - Unnecessary client-side fetching
("use client");
export default function ChatPage({ params }) {
  const [chat, setChat] = useState(null);

  useEffect(() => {
    getChat(params.id).then(setChat); // Could be Server Component
  }, []);

  return <ChatMessages data={chat} />;
}
```

### **6. Use API Routes for Streaming**

For streaming responses (OpenAI, file uploads), use API routes:

```typescript
// ✅ GOOD - API route for streaming
// app/api/openai/route.ts
export async function POST(request: NextRequest) {
  const session = await auth0.getSession(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [...],
    stream: true,
  });

  return new Response(stream.toReadableStream());
}

// ❌ BAD - Server Actions can't stream
"use server";
export async function streamChat(message: string) {
  // Can't return ReadableStream from Server Action
}
```

---

## 🚫 Common Pitfalls

### **1. Using React Query with Server Actions**

```typescript
// ❌ WRONG - React Query removed from project
import { useQuery } from "@tanstack/react-query";

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => getAllChats(),
  });
};

// ✅ CORRECT - Server Component or direct Server Action call
export default async function ChatsPage() {
  const chats = await getAllChats();
  return <ChatList data={chats} />;
}
```

### **2. Throwing Errors in Server Actions**

```typescript
// ❌ WRONG
"use server";
export async function deleteChat(id: string) {
  const result = await del(URLs.DELETE_CHAT, id);
  if (result.__isError) {
    throw new Error(result.message); // Won't serialize!
  }
  return result;
}

// ✅ CORRECT
("use server");
export async function deleteChat(id: string) {
  try {
    const result = await del(URLs.DELETE_CHAT, id);
    if (result && !(result as any).__isError) {
      revalidatePath(ENUMs.TAGS.CHATS);
    }
    return result;
  } catch (error) {
    return handleServerError(error);
  }
}
```

### **3. Not Checking for `__isError`**

```typescript
// ❌ WRONG - Ignores errors
const handleDelete = async (id: string) => {
  await deleteChat(id);
  toast.success("Deleted!"); // Shows even if error occurred
};

// ✅ CORRECT - Checks for errors
const handleDelete = async (id: string) => {
  const result = await deleteChat(id);
  if (result?.__isError) {
    toast.error(result.message);
    return;
  }
  toast.success("Deleted!");
};
```

### **4. Using fetch Instead of Server Actions**

```typescript
// ❌ WRONG - Direct fetch in client component
"use client";
export function ChatList() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch("/api/chats").then(res => res.json()).then(setChats);
  }, []);

  return <div>{chats.map(chat => ...)}</div>;
}

// ✅ CORRECT - Server Component with Server Action
export default async function ChatsPage() {
  const chats = await getAllChats();
  return <ChatList data={chats} />;
}
```

### **5. useState for Streaming Instead of Zustand**

```typescript
// ❌ WRONG - Too many re-renders
"use client";
export function ChatMessages() {
  const [response, setResponse] = useState("");

  const handleStream = async () => {
    await sendChat(message, chatId, (chunk) => {
      setResponse((prev) => prev + chunk); // Re-renders entire component!
    });
  };
}

// ✅ CORRECT - Zustand for efficient updates
("use client");
export function ChatMessages() {
  const { currentAiResponse, appendToResponse } = useChatStore();

  const handleStream = async () => {
    await sendChat(message, chatId, (chunk) => {
      appendToResponse(chunk); // Only updates store, minimal re-renders
    });
  };
}
```

---

## 🎓 Summary

**Key Takeaways:**

1. ✅ Server Actions return **plain objects**, never throw
2. ✅ Use `__isError: true` flag to mark errors
3. ✅ Always check for `__isError` in Server Actions
4. ✅ Handle errors in client components with toast notifications
5. ✅ Use **Zustand** for streaming state management
6. ✅ Use **API routes** for OpenAI streaming
7. ✅ Use **Server Components** for initial data fetching
8. ✅ Use **Server Actions** for data mutations

**The Pattern:**

```
Client Component → Server Action → API Config → Backend/MongoDB
                       ↓
                  Error Object
                       ↓
            Client Component (toast)
```

**Streaming Pattern:**

```
User Input → ChatInput → sendChat() → /api/openai
                                          ↓
                                   OpenAI Stream
                                          ↓
                                   Zustand Store
                                          ↓
                               ChatMessages (UI)
```

This architecture ensures:

- ✅ Errors work in production
- ✅ Type-safe error handling
- ✅ Proper error messages displayed
- ✅ Real-time AI streaming
- ✅ Efficient state updates
- ✅ Great user experience

---

## 📚 Related Documentation

- [Authentication](./authentication.md) - Auth0 setup and patterns
- [Component Organization](./component-organization.md) - Component structure
- [Cookie Management](./cookie-management.md) - cookies-next usage
- [Internationalization](./internationalization.md) - Multi-language support
- [UI Components](./ui-components.md) - shadcn/ui usage
