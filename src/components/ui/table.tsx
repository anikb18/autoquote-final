import { clsx } from 'clsx'
import type React from 'react'
import { createContext, useContext } from 'react'
import { Link } from './link'

const TableContext = createContext<{ bleed: boolean; dense: boolean; grid: boolean; striped: boolean }>({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
})

export function Table({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  className,
  children,
  ...props
}: { bleed?: boolean; dense?: boolean; grid?: boolean; striped?: boolean } & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <TableContext.Provider value={{ bleed, dense, grid, striped }}>
      <div className="flow-root">
        <div {...props} className={clsx(className, 'overflow-x-auto')}>
          <div className={clsx('inline-block min-w-full align-middle', !bleed && 'px-4')}>
            <table className="min-w-full text-left text-sm/6">{children}</table>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  )
}

export function TableHead({ className, ...props }: React.ComponentPropsWithoutRef<'thead'>) {
  return <thead {...props} className={clsx(className, 'text-muted-foreground bg-muted/50')} />
}

export function TableBody(props: React.ComponentPropsWithoutRef<'tbody'>) {
  return <tbody {...props} />
}

const TableRowContext = createContext<{ href?: string; target?: string; title?: string }>({
  href: undefined,
  target: undefined,
  title: undefined,
})

export function TableRow({
  href,
  target,
  title,
  className,
  children,
  ...props
}: { href?: string; target?: string; title?: string } & React.ComponentPropsWithoutRef<'tr'>) {
  const { striped } = useContext(TableContext)

  return (
    <TableRowContext.Provider value={{ href, target, title }}>
      <tr
        {...props}
        className={clsx(
          className,
          href && 'cursor-pointer focus-within:bg-accent hover:bg-accent/50',
          striped && 'even:bg-muted/50',
          'transition-colors'
        )}
      >
        {children}
      </tr>
    </TableRowContext.Provider>
  )
}

export function TableHeader({ className, ...props }: React.ComponentPropsWithoutRef<'th'>) {
  const { bleed, grid } = useContext(TableContext)

  return (
    <th
      {...props}
      className={clsx(
        className,
        'border-b h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        grid && 'border-l first:border-l-0',
        !bleed && 'first:pl-4 last:pr-4'
      )}
    />
  )
}

export function TableCell({ className, children, ...props }: React.ComponentPropsWithoutRef<'td'>) {
  const { bleed, dense, grid } = useContext(TableContext)
  const { href, target, title } = useContext(TableRowContext)

  return (
    <td
      {...props}
      className={clsx(
        className,
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        grid && 'border-l first:border-l-0',
        dense ? 'py-2' : 'py-4',
        !bleed && 'first:pl-4 last:pr-4'
      )}
    >
      {href ? (
        <Link
          href={href}
          target={target}
          aria-label={title}
          className="block -m-4 p-4 hover:bg-accent/50"
        >
          {children}
        </Link>
      ) : (
        children
      )}
    </td>
  )
}