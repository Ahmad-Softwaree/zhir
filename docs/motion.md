# 🎬 Motion & Animations (motion/react)

This document outlines the standards for implementing animations using **motion/react** in this project.

---

## 🚨 CRITICAL: Motion Component Rules

### 📍 Centralized Location

- **ALL motion/animation components MUST be in** [components/shared/animate.tsx](../components/shared/animate.tsx)
- **NEVER create motion components** in other files
- **DO NOT use inline motion/react** code in pages or components

### ♻️ Reusability Rule

**If an animation is used MORE THAN ONCE anywhere in the app, it MUST be a reusable component in** [animate.tsx](../components/shared/animate.tsx)

### ✅ DO:

```tsx
// ✅ CORRECT: Use reusable component from animate.tsx
import { AnimateOnScroll } from "@/components/shared/animate";

export function MyComponent() {
  return (
    <AnimateOnScroll animation="fade-up">
      <div>Content here</div>
    </AnimateOnScroll>
  );
}
```

### ❌ DON'T:

```tsx
// ❌ WRONG: Inline motion code
import { motion } from "motion/react";

export function MyComponent() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      Content
    </motion.div>
  );
}
```

---

## 📦 Available Animation Components

All components are exported from [components/shared/animate.tsx](../components/shared/animate.tsx):

### Core Animations

- **`AnimateOnScroll`** - Animates when entering viewport
- **`StaggerAnimate`** - Animates list items with staggered delays
- **`StaggerContainer`** + **`StaggerItem`** - Grid/container stagger animations
- **`StaggeredGrid`** - Grid with custom animation key

### Specialized Motions

- **`FadeInTop`** - Fade in from top
- **`FadeInUpMotion`** - Fade in upward (detail pages)
- **`SlideInMotion`** - Slide from left or right
- **`ScrollRevealMotion`** - Reveals on scroll
- **`BackBtnMotion`** - Back button slide-in
- **`HeaderSlideMotion`** - Header slide down
- **`CardHoverMotion`** - Card hover animations
- **`FloatingIconMotion`** - Floating/rotating icon
- **`BlobMotion`** - Blob-style animation

---

## 📖 Usage Example

### AnimateOnScroll Component

```tsx
import { AnimateOnScroll } from "@/components/shared/animate";

export function FeatureSection() {
  return (
    <AnimateOnScroll animation="fade-up" delay={0.2} duration={0.6}>
      <h2>Feature Title</h2>
      <p>Feature description...</p>
    </AnimateOnScroll>
  );
}
```

**Props:**

- `animation`: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "zoom-out"
- `delay`: Number (default: 0)
- `duration`: Number (default: 0.6)
- `className`: Optional styling

---

## 🔧 Creating New Motion Components

When creating a new reusable animation:

1. **Add it to** [components/shared/animate.tsx](../components/shared/animate.tsx)
2. **Export the component** at the bottom of the file
3. **Use TypeScript** for props
4. **Include `className` prop** for styling flexibility
5. **Use `cn()` utility** for class merging

**Template:**

```tsx
interface MyMotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MyMotion({ children, className, delay = 0 }: MyMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn(className)}>
      {children}
    </motion.div>
  );
}
```

---

## ✅ Checklist

Before implementing animations:

- [ ] Is this animation used more than once?
  - **YES** → Create reusable component in [animate.tsx](../components/shared/animate.tsx)
  - **NO** → Consider if it might be reused later
- [ ] Am I importing from `@/components/shared/animate`?
- [ ] Did I use the `cn()` utility for className props?
- [ ] Is the component properly typed with TypeScript?
- [ ] Did I mark the component with `"use client"`? (already in animate.tsx)

---

## 🎯 Quick Reference

| Need             | Component                          | Import                        |
| ---------------- | ---------------------------------- | ----------------------------- |
| Scroll animation | `AnimateOnScroll`                  | `@/components/shared/animate` |
| List stagger     | `StaggerAnimate`                   | `@/components/shared/animate` |
| Grid stagger     | `StaggerContainer` + `StaggerItem` | `@/components/shared/animate` |
| Card hover       | `CardHoverMotion`                  | `@/components/shared/animate` |
| Fade in          | `FadeInTop` / `FadeInUpMotion`     | `@/components/shared/animate` |
| Slide in         | `SlideInMotion`                    | `@/components/shared/animate` |

---

## 🔒 Enforcement

- **All motion code belongs in** [animate.tsx](../components/shared/animate.tsx)
- **No exceptions** - even one-off animations should follow this pattern
- **Keep it DRY** - Don't duplicate animation logic

**Remember:** Centralized animations = consistent UX + easier maintenance.
