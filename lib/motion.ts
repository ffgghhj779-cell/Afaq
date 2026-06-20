import type { Variants } from 'motion/react';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** GPU-friendly fade — opacity + translateY only (no blur/filter). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const fadeUpFast: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const slideDown = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

export const slidePanel = (fromRight: boolean) => ({
  initial: { opacity: 0, x: fromRight ? 320 : -320 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: { opacity: 0, x: fromRight ? 320 : -320, transition: { duration: 0.25, ease: EASE_OUT } },
});

export const viewportOnce = { once: true, margin: '-80px' as const };
