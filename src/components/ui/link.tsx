import { Link as RouterLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface LinkProps extends React.ComponentPropsWithoutRef<typeof RouterLink> {
  href?: string
}

export function Link({ className, children, href, to, ...props }: LinkProps) {
  return (
    <RouterLink
      to={to || href || '#'}
      className={cn('text-primary hover:underline', className)}
      {...props}
    >
      {children}
    </RouterLink>
  )
}