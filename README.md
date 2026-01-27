# 🤖 AI Chat

A modern AI-powered conversation platform built with Next.js, providing intelligent responses using GPT technology.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)
![Auth0](https://img.shields.io/badge/Auth0-Authentication-EB5424?style=flat&logo=auth0)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb)

---

## ✨ Features

- 💬 **AI Conversations** - Intelligent chat powered by GPT technology
- 🔐 **Secure Authentication** - User accounts with Auth0
- 👤 **User Profiles** - Manage account settings and preferences
- 🌍 **Multi-language Support** - English, Arabic, and Kurdish (CKB)
- 🎨 **Modern UI** - Built with shadcn/ui components
- 🌙 **Dark/Light Mode** - Seamless theme switching
- 📱 **Responsive Design** - Works on all devices

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
# Auth0 Configuration
AUTH0_SECRET=your-secret-key
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-chat

# OpenAI (for GPT)
OPENAI_API_KEY=your-openai-api-key
```

4. **Run the development server:**

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
zhir/
├── app/                  # Next.js App Router
│   ├── [locale]/         # Internationalized routes
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (root)/       # Public pages
│   │   └── layout.tsx    # Root layout
├── components/           # React components
│   ├── ui/               # shadcn/ui components
│   ├── layouts/          # Layout components
│   ├── sections/         # Page sections
│   └── shared/           # Shared components
├── lib/                  # Utilities and configurations
│   ├── auth0.ts          # Auth0 configuration
│   ├── models/           # Mongoose models
│   └── react-query/      # React Query setup
├── messages/             # i18n translations
│   ├── en.json           # English
│   ├── ar.json           # Arabic
│   └── ckb.json          # Kurdish
├── docs/                 # Documentation
└── AGENTS.md             # Development guidelines
```

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Motion/React** - Smooth animations
- **next-intl** - Internationalization

### Backend

- **Auth0** - Authentication and authorization
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Server Actions** - Server-side data mutations

### State Management

- **React Query** - Server state management
- **nuqs** - URL state management
- **next-themes** - Theme management
- **cookies-next** - Cookie management

---

## 📖 Documentation

- **[AGENTS.md](AGENTS.md)** - Development guidelines and coding standards
- **[docs/authentication.md](docs/authentication.md)** - Auth0 setup and usage
- **[docs/component-organization.md](docs/component-organization.md)** - Component structure
- **[docs/data-fetching-error-handling.md](docs/data-fetching-error-handling.md)** - Data patterns

---

## 🌍 Internationalization

Supported languages:

- 🇬🇧 **English** (en)
- 🇸🇦 **Arabic** (ar)
- 🇮🇶 **Kurdish (CKB)** (ckb)

Translation files are in `messages/` directory.

---

## 🎨 Theme

The application supports dark and light modes with a ChatGPT-inspired color palette.

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please read [AGENTS.md](AGENTS.md) for development guidelines.

---

**Built with ❤️ using Next.js, Auth0, and MongoDB**
