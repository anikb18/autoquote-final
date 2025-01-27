"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, LayoutGroup } from "framer-motion";
import { Link } from "@/components/ui/link";

export function Navbar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      {...props}
      className={cn(className, "flex flex-1 items-center gap-4 py-2.5")}
    />
  );
}

export function NavbarDivider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn(className, "h-6 w-px bg-zinc-950/10 dark:bg-white/10")}
    />
  );
}

export function NavbarSection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const id = React.useId();

  return (
    <LayoutGroup id={id}>
      <div {...props} className={cn(className, "flex items-center gap-3")} />
    </LayoutGroup>
  );
}

export function NavbarSpacer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn(className, "-ml-4 flex-1")}
    />
  );
}

interface NavbarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  current?: boolean;
  href?: string;
  className?: string;
}

export const NavbarItem = React.forwardRef<HTMLButtonElement, NavbarItemProps>(
  ({ current, className, children, href, ...props }, ref) => {
    const classes = cn(
      "relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 font-medium text-zinc-950 sm:text-sm/5",
      "data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5",
      "data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950",
      "data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950",
      "dark:text-white dark:data-[slot=icon]:*:fill-zinc-400",
      "dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white",
      "dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white",
      className,
    );

    return (
      <span className="relative">
        {current && (
          <motion.span
            layoutId="current-indicator"
            className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-zinc-950 dark:bg-white"
          />
        )}
        {href ? (
          <Link
            href={href}
            className={classes}
            data-current={current ? "true" : undefined}
          >
            {children}
          </Link>
        ) : (
          <button
            {...props}
            className={cn("cursor-default", classes)}
            data-current={current ? "true" : undefined}
            ref={ref}
          >
            {children}
          </button>
        )}
      </span>
    );
  },
);
NavbarItem.displayName = "NavbarItem";

export function NavbarLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return <span {...props} className={cn(className, "truncate")} />;
}
