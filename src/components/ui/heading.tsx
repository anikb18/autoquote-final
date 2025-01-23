import * as React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export function Heading({ 
  className, 
  level = 1, 
  children,
  ...props 
}: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Component
      className={cn(
        "text-2xl font-semibold tracking-tight text-foreground sm:text-xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export function Subheading({ 
  className, 
  level = 2, 
  children,
  ...props 
}: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Component
      className={cn(
        "text-base font-semibold text-foreground sm:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}