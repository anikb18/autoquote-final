import { cn } from "@/lib/utils"
import React from "react"

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
} & React.HTMLAttributes<HTMLHeadingElement>

export function Heading({ className, level = 1, children, ...props }: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  
  return (
    <Component
      {...props}
      className={cn(
        "text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white",
        className
      )}
    >
      {children}
    </Component>
  )
}

export function Subheading({ className, level = 2, children, ...props }: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  
  return (
    <Component
      {...props}
      className={cn(
        "text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white",
        className
      )}
    >
      {children}
    </Component>
  )
}