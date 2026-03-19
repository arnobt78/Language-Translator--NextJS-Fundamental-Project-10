"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

/** Single ripple: position (relative to button) and id for list key and removal */
interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Button that shows a ripple effect on click (per RIPPLE_BUTTON_EFFECT.md).
 * Ripple is purely visual; button semantics and accessibility unchanged.
 *
 * WALKTHROUGH: On click we record click position in button coordinates, add a ripple
 * to state (rendered as .ripple-wave in globals.css), remove it after 750ms, then call
 * the passed onClick. Use like <RippleButton onClick={...}>Label</RippleButton>.
 */
export function RippleButton({
  children,
  className,
  onClick,
  ...rest
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 750);
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <button
      type="button"
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map(({ id, x, y }) => (
        <span
          key={id}
          className="ripple-wave"
          style={{
            left: x,
            top: y,
          }}
          aria-hidden
        />
      ))}
    </button>
  );
}
