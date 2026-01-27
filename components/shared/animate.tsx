"use client";

import { ReactNode } from "react";
import { motion, Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "zoom-in"
    | "zoom-out";
  delay?: number;
  duration?: number;
}

/**
 * Reusable scroll animation component using motion/react
 * Animates children when they enter the viewport
 */
export function AnimateOnScroll({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 0.6,
}: AnimateOnScrollProps) {
  const variants: Record<string, Variants> = {
    "fade-up": {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    "fade-down": {
      hidden: { opacity: 0, y: -40 },
      visible: { opacity: 1, y: 0 },
    },
    "fade-left": {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0 },
    },
    "fade-right": {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0 },
    },
    "zoom-in": {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
    "zoom-out": {
      hidden: { opacity: 0, scale: 1.05 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration, delay }}
      variants={variants[animation]}>
      {children}
    </motion.div>
  );
}

/**
 * Stagger animation for lists
 * Each child will animate with an incremental delay
 */
interface StaggerAnimateProps {
  children: ReactNode[];
  className?: string;
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "zoom-in"
    | "zoom-out";
  staggerDelay?: number;
  duration?: number;
}

export function StaggerAnimate({
  children,
  className,
  animation = "fade-up",
  staggerDelay = 0.05,
  duration = 0.6,
}: StaggerAnimateProps) {
  return (
    <>
      {children.map((child, index) => (
        <AnimateOnScroll
          key={index}
          className={className}
          animation={animation}
          delay={index * staggerDelay}
          duration={duration}>
          {child}
        </AnimateOnScroll>
      ))}
    </>
  );
}

/**
 * Stagger container for grid items with motion.div
 * Used for project cards, certification cards, etc.
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}>
      {children}
    </motion.div>
  );
}

/**
 * Individual stagger item - used inside StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <motion.div className={cn(className)} variants={item}>
      {children}
    </motion.div>
  );
}

export const BlobMotion = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className={cn(className)}
    />
  );
};

/**
 * Fade in from top motion
 */
interface FadeInTopProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInTop({
  children,
  className,
  delay = 0.1,
}: FadeInTopProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(className)}>
      {children}
    </motion.div>
  );
}

/**
 * Staggered grid container with custom key for re-animations
 */
interface StaggeredGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  animationKey?: string;
}

export function StaggeredGrid({
  children,
  className,
  staggerDelay = 0.1,
  animationKey,
}: StaggeredGridProps) {
  return (
    <motion.div
      key={animationKey}
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}>
      {children}
    </motion.div>
  );
}

/**
 * Back button motion - slides in from left
 */
interface BackBtnMotionProps {
  children: ReactNode;
  className?: string;
}

export function BackBtnMotion({ children, className }: BackBtnMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(className)}>
      {children}
    </motion.div>
  );
}

/**
 * Fade in up motion - for detail page sections
 */
interface FadeInUpMotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInUpMotion({
  children,
  className,
  delay = 0,
}: FadeInUpMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(className)}>
      {children}
    </motion.div>
  );
}

/**
 * Card hover motion - for project and tool cards
 */
interface CardHoverMotionProps {
  children: ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function CardHoverMotion({
  children,
  className,
  onMouseEnter,
  onMouseLeave,
}: CardHoverMotionProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      {children}
    </motion.div>
  );
}

/**
 * Slide in from side motion - for special tool cards
 */
interface SlideInMotionProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
}

export function SlideInMotion({
  children,
  className,
  direction = "left",
}: SlideInMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(className)}>
      {children}
    </motion.div>
  );
}

/**
 * Header slide down motion
 */
interface HeaderSlideMotionProps {
  children: ReactNode;
  className?: string;
}

export function HeaderSlideMotion({
  children,
  className,
}: HeaderSlideMotionProps) {
  return (
    <motion.header
      className={cn(className)}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}>
      {children}
    </motion.header>
  );
}

/**
 * Icon floating motion - for special tool card icons
 */
interface FloatingIconMotionProps {
  children: ReactNode;
  className?: string;
}

export function FloatingIconMotion({
  children,
  className,
}: FloatingIconMotionProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={cn(className)}>
      {children}
    </motion.div>
  );
}

/**
 * Scroll reveal motion - reveals content when scrolling into view
 */
interface ScrollRevealMotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollRevealMotion({
  children,
  className,
  delay = 0,
}: ScrollRevealMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={cn(className)}>
      {children}
    </motion.div>
  );
}

/**
 * Floating Blob - animated background blob for hero sections
 */
interface FloatingBlobProps {
  className?: string;
  delay?: number;
}

export function FloatingBlob({ className, delay = 0 }: FloatingBlobProps) {
  return (
    <motion.div
      className={cn("rounded-full blur-3xl", className)}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -30, 0],
        rotate: [0, 90, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
