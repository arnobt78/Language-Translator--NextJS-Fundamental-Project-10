import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names: clsx handles conditionals/arrays, twMerge resolves Tailwind conflicts.
 * Use for component className props, e.g. cn("base", isActive && "active", className).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
