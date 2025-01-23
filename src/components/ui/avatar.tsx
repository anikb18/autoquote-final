import * as React from "react";
import { clsx } from "clsx";
import { Link } from "./link";

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  square?: boolean;
  initials?: string;
  alt?: string;
  className?: string;
}

export function Avatar({
  src = null,
  square = false,
  initials,
  alt = '',
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      {...props}
      className={clsx(
        className,
        'inline-grid shrink-0 select-none overflow-hidden align-middle',
        square ? 'rounded-md' : 'rounded-full',
        'bg-muted h-10 w-10'
      )}
    >
      {initials && !src && (
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden={alt ? undefined : 'true'}
        >
          {alt && <title>{alt}</title>}
          <text
            x="50%"
            y="50%"
            alignmentBaseline="middle"
            dominantBaseline="middle"
            textAnchor="middle"
            dy=".125em"
            className="text-xl font-medium uppercase"
          >
            {initials}
          </text>
        </svg>
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      )}
    </span>
  );
}

interface AvatarButtonProps extends AvatarProps {
  href?: string;
  onClick?: () => void;
}

export const AvatarButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, AvatarButtonProps>(
  function AvatarButton({ href, className, ...props }, ref) {
    const classes = clsx(
      className,
      'relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'
    );

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
          <Avatar {...props} />
        </Link>
      );
    }

    return (
      <button
        type="button"
        className={classes}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
      >
        <Avatar {...props} />
      </button>
    );
  }
);

AvatarButton.displayName = "AvatarButton";