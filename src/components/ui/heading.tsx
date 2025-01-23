import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ 
  children, 
  className, 
  level = 1,
  ...props 
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={cn(
        "scroll-m-20 tracking-tight",
        {
          "text-4xl font-extrabold lg:text-5xl": level === 1,
          "text-3xl font-semibold": level === 2,
          "text-2xl font-semibold": level === 3,
          "text-xl font-semibold": level === 4,
          "text-lg font-semibold": level === 5,
          "text-base font-semibold": level === 6,
        },
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}