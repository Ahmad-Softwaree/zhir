# 🤖 Zhir AI Chat

A modern AI-powered conversation platform built with Next.js 16, providing intelligent responses using OpenAI's GPT-3.5 Turbo with real-time streaming capabilities.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)
![Auth0](https://img.shields.io/badge/Auth0-Authentication-EB5424?style=flat&logo=auth0)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb)
![Bun](https://img.shields.io/badge/Bun-Package_Manager-f9f1e1?style=flat&logo=bun)

---

## ✨ Features

- 💬 **Real-time AI Chat** - GPT-3.5 Turbo with streaming responses
- 🔐 **Secure Authentication** - Auth0 integration with session management
- 💾 **Chat History** - Persistent conversations stored in MongoDB
- 🌍 **Multi-language Support** - English, Arabic, and Kurdish (CKB)
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS 4
- 🌙 **Dark/Light Mode** - Seamless theme switching with next-themes
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Optimized Performance** - Server Components and streaming UI
- 🗂️ **Chat Management** - Create, view, and delete conversations

---

## 🚀 Getting Started

### Prerequisites

- **Bun** (package manager)
- **Node.js** 18+
- **Auth0 Account** (for authentication)
- **MongoDB** (for database)

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd zhir
```

2. **Install dependencies:**

```bash
bun install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
# Auth0 Configuration (Required)
AUTH0_SECRET=your-secret-key-here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# MongoDB (Required)
MONGODB_URI=mongodb://localhost:27017/zhir

# OpenAI API (Required)
OPEN_AI_API_KEY=your-openai-api-key

# Backend API URL (Optional - defaults to "/")
NEXT_PUBLIC_API=http://localhost:3000
```

**Note:** See [docs/auth0-implementation-guide.md](docs/auth0-implementation-guide.md) for detailed Auth0 setup instructions.

4. **Run the development server:**

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
zhir/
├── app/                       # Next.js App Router
│   ├── [locale]/              # Internationalized routes
│   │   ├── (auth)/            # Protected routes
│   │   │   ├── chat/          # Chat interface
│   │   │   │   ├── page.tsx   # Welcome screen
│   │   │   │   └── [id]/      # Individual chat conversation
│   │   │   └── layout.tsx     # Auth layout with sidebar
│   │   ├── (root)/            # Public routes
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── signin/        # Sign-in page
│   │   │   └── signup/        # Sign-up page
│   │   └── layout.tsx         # Locale layout
│   └── api/                   # API routes
│       ├── auth/              # Auth0 API routes
│       ├── chat/              # Chat CRUD operations
│       ├── chats/             # Get all chats
│       └── openai/            # OpenAI streaming endpoint
├── components/                # React components
│   ├── ui/                    # shadcn/ui primitives
│   ├── chat/                  # Chat-specific components
│   │   ├── ChatInput.tsx      # Message input
│   │   ├── ChatMessages.tsx   # Message display
│   │   ├── AiMessage.tsx      # AI response
│   │   ├── UserMessage.tsx    # User message
│   │   └── WelcomeMessage.tsx # Welcome screen
│   ├── cards/                 # Card components
│   ├── layouts/               # Layout components
│   │   ├── header.tsx         # Main header
│   │   ├── footer.tsx         # Footer
│   │   └── sidebar.tsx        # Chat sidebar
│   ├── sections/              # Page sections
│   │   └── hero.tsx           # Landing hero
│   └── shared/                # Shared utilities
├── lib/                       # Core utilities
│   ├── auth0.ts               # Auth0 SDK config
│   ├── actions/               # Server Actions
│   │   ├── chat.action.ts     # Client-side chat streaming
│   │   └── chat.server.action.ts  # Server-side chat CRUD
│   ├── config/                # Configuration
│   │   └── api.config.ts      # Fetch wrapper with cookies
│   ├── db/                    # Database
│   │   ├── mongodb.ts         # MongoDB connection
│   │   └── models/            # Mongoose schemas
│   │       └── Chat.ts        # Chat model
│   ├── store/                 # Zustand stores
│   │   ├── chat.store.ts      # Chat state (streaming)
│   │   └── modal.store.ts     # Modal state
│   ├── enums.ts               # Constants and enums
│   ├── urls.ts                # API endpoints
│   ├── error-handler.ts       # Error utilities
│   └── utils.ts               # Helper functions
├── messages/                  # Internationalization
│   ├── en.json                # English translations
│   ├── ar.json                # Arabic translations
│   └── ckb.json               # Kurdish translations
├── i18n/                      # i18n configuration
│   ├── routing.ts             # Locale routing
│   └── request.ts             # Request handler
├── docs/                      # Documentation
│   ├── auth0-implementation-guide.md
│   ├── component-organization.md
│   ├── data-fetching-error-handling.md
│   └── ... (see Documentation section)
└── AGENTS.md                  # AI agent instructions
```

---

## 🛠️ Tech Stack

### Core Framework

- **Next.js 16** - React framework with App Router and React Server Components
- **React 19** - Latest React with Server Components support
- **TypeScript 5** - Type-safe development
- **Bun** - Fast JavaScript runtime and package manager

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Accessible UI component library
- **Motion/React** - Smooth animations and transitions
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Authentication & Security

- **Auth0 NextJS SDK** - Complete authentication solution
- **Session Management** - Secure server-side sessions

### Database & ODM

- **MongoDB** - NoSQL database for chat storage
- **Mongoose** - MongoDB object modeling and validation

### AI & Streaming

- **OpenAI SDK** - GPT-3.5 Turbo integration
- **Streaming API** - Real-time AI response streaming
- **Server Actions** - Server-side data mutations

### State Management

- **Zustand** - Client-side state (chat streaming)
- **Server Actions** - Server-side mutations
- **React Server Components** - Initial data fetching
- **nuqs** - Type-safe URL state management
- **next-themes** - Dark/light mode management
- **cookies-next** - Cookie handling

### Internationalization

- **next-intl** - i18n for App Router (English, Arabic, Kurdish)

### Developer Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 🏗️ Architecture

### Data Flow

```
Client Component → Server Action → API Config → Backend API
                      ↓
                 Error Handling
                      ↓
                  Toast/UI Update
```

### Chat Streaming Flow

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

### Authentication Flow

```
User → Auth0 Login → Session Cookie → Protected Routes
                                            ↓
                                  getSession() / useUser()
                                            ↓
                                    Authorized Access
```

## 📖 Documentation

### Core Guides

- **[AGENTS.md](AGENTS.md)** - **READ FIRST** - AI agent coding standards and rules
- **[docs/auth0-implementation-guide.md](docs/auth0-implementation-guide.md)** - Complete Auth0 setup
- **[docs/authentication.md](docs/authentication.md)** - Authentication patterns
- **[docs/data-fetching-error-handling.md](docs/data-fetching-error-handling.md)** - Server Actions architecture

### Component & Code Organization

- **[docs/component-organization.md](docs/component-organization.md)** - Component structure rules
- **[docs/folder-file-conventions.md](docs/folder-file-conventions.md)** - File naming conventions
- **[docs/ui-components.md](docs/ui-components.md)** - shadcn/ui usage

### Features

- **[docs/internationalization.md](docs/internationalization.md)** - Multi-language setup
- **[docs/theme-dark-light-mode.md](docs/theme-dark-light-mode.md)** - Theme configuration
- **[docs/url-parameters.md](docs/url-parameters.md)** - URL state with nuqs
- **[docs/cookie-management.md](docs/cookie-management.md)** - cookies-next usage
- **[docs/motion.md](docs/motion.md)** - Animation patterns

### Development

- **[docs/package-management.md](docs/package-management.md)** - Bun guidelines
- **[docs/documentation-standards.md](docs/documentation-standards.md)** - How to document

---

## 🌍 Internationalization

Supported languages:

- 🇬🇧 **English** (`en`) - Default
- 🇸🇦 **Arabic** (`ar`) - RTL support
- 🇮🇶 **Kurdish (CKB)** (`ckb`) - Central Kurdish

Translation files are in `messages/` directory. See [docs/internationalization.md](docs/internationalization.md) for details.

---

## 🎨 Theme

Dark and light modes with ChatGPT-inspired color palette:

- **Light Mode** - Clean, minimal design
- **Dark Mode** - Eye-friendly with proper contrast
- **Smooth Transitions** - Animated theme switching

See [docs/theme-dark-light-mode.md](docs/theme-dark-light-mode.md) for customization.

---

## 🔧 Development Workflow

### Adding a New Feature

1. **Read** [AGENTS.md](AGENTS.md) for coding standards
2. **Check** approved libraries list - NO unapproved dependencies
3. **Use** Server Actions for data mutations
4. **Follow** component organization rules
5. **Test** in all languages and themes

### Common Tasks

```bash
# Add a shadcn/ui component
npx shadcn@latest add [component-name]

# Install packages (ALWAYS use bun)
bun add [package-name]

# Check for errors
bun run lint

# Build for production
bun run build
```

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**

- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running locally or accessible

**Auth0 Errors:**

- Verify all `AUTH0_*` variables are set
- Check callback URLs in Auth0 dashboard
- See [docs/auth0-implementation-guide.md](docs/auth0-implementation-guide.md)

**OpenAI Streaming Issues:**

- Verify `OPEN_AI_API_KEY` is valid
- Check API quota/billing
- Ensure model `gpt-3.5-turbo` is accessible

**Package Installation:**

- Always use `bun install` or `bun add`
- NEVER use npm, yarn, or pnpm

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Read [AGENTS.md](AGENTS.md) for development guidelines
2. Follow the established patterns and architecture
3. Use ONLY approved libraries
4. Write TypeScript (no JavaScript files)
5. Test thoroughly before submitting

---

## 🙏 Acknowledgments

- **OpenAI** - GPT-3.5 Turbo API
- **Auth0** - Authentication platform
- **shadcn/ui** - Component library
- **Vercel** - Next.js framework

---

**Built with ❤️ by Ahmad Software using Next.js 16, Auth0, MongoDB, and OpenAI**
