import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative block w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:border-white/10 dark:focus-visible:ring-accent md:text-sm",
            // Date input specific styles
            type &&
              ["date", "datetime-local", "month", "time", "week"].includes(
                type,
              ) && [
                "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
                "[&::-webkit-date-and-time-value]:min-h-[1.5em]",
                "[&::-webkit-datetime-edit]:inline-flex",
                "[&::-webkit-datetime-edit]:p-0",
                "[&::-webkit-datetime-edit-year-field]:p-0",
                "[&::-webkit-datetime-edit-month-field]:p-0",
                "[&::-webkit-datetime-edit-day-field]:p-0",
                "[&::-webkit-datetime-edit-hour-field]:p-0",
                "[&::-webkit-datetime-edit-minute-field]:p-0",
                "[&::-webkit-datetime-edit-second-field]:p-0",
                "[&::-webkit-datetime-edit-millisecond-field]:p-0",
                "[&::-webkit-datetime-edit-meridiem-field]:p-0",
              ],
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };

export function InputGroup({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex items-center",
        "[&_svg]:absolute [&_svg]:left-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-muted-foreground",
        "[&_input]:pl-10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
InputGroup.displayName = "InputGroup";
