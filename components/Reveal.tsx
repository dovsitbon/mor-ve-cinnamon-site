"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const TAGS = { div: motion.div, li: motion.li } as const;

/** Apparition lente en fondu ; `as="li"` pour rester valide dans une liste. */
export function Reveal({ children, delay = 0, className, y = 24, as = "div" }: { children: ReactNode; delay?: number; className?: string; y?: number; as?: keyof typeof TAGS }) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
