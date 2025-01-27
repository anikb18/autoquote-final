import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-1.5 py-0.5 text-sm/5 font-medium ring-1 ring-inset transition-colors sm:text-xs/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary ring-primary/20 hover:bg-primary/20",
        secondary:
          "bg-secondary/10 text-secondary ring-secondary/20 hover:bg-secondary/20",
        accent: "bg-accent/10 text-accent ring-accent/20 hover:bg-accent/20",
        destructive:
          "bg-destructive/10 text-destructive ring-destructive/20 hover:bg-destructive/20",
        success:
          "bg-green-500/10 text-green-700 ring-green-500/20 hover:bg-green-500/20 dark:text-green-400",
        warning:
          "bg-yellow-400/10 text-yellow-700 ring-yellow-400/20 hover:bg-yellow-400/20 dark:text-yellow-300",
        info: "bg-blue-500/10 text-blue-700 ring-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
