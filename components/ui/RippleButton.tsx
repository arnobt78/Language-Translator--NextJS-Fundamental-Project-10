"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

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
      }, 600);
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
      {children}
      {ripples.map(({ id, x, y }) => (
        <span
          key={id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: x,
            top: y,
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
          }}
        />
      ))}
    </button>
  );
}
