import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  to?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, children, variant = "default", size = "default", to, ...props }, ref) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
        "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
        "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80": variant === "secondary",
        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
        "text-primary underline-offset-4 hover:underline": variant === "link",
      },
      {
        "h-9 px-4 py-2": size === "default",
        "h-8 rounded-md px-3 text-xs": size === "sm",
        "h-10 rounded-md px-8": size === "lg",
        "h-9 w-9": size === "icon",
      },
      className
    );

    if (to) {
      return (
        <Link to={to} className={baseStyles} ref={ref as React.Ref<HTMLAnchorElement>}>
          {children}
        </Link>
      );
    }

    return (
      <button className={baseStyles} ref={ref as React.Ref<HTMLButtonElement>} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const buttonVariants = ({
  variant = "default",
  size = "default",
  className = "",
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}) =>
  cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
      "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
      "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
      "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80": variant === "secondary",
      "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
      "text-primary underline-offset-4 hover:underline": variant === "link",
    },
    {
      "h-9 px-4 py-2": size === "default",
      "h-8 rounded-md px-3 text-xs": size === "sm",
      "h-10 rounded-md px-8": size === "lg",
      "h-9 w-9": size === "icon",
    },
    className
  );