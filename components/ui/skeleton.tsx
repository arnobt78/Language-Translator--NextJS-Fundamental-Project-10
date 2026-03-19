import { cn } from "@/lib/utils"

/** Placeholder with animate-pulse; used for loading states (e.g. TranslatorApp output area). */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
