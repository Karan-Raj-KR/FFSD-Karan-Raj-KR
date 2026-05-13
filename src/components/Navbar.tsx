/**
 * Navbar.tsx
 * 
 * Top navigation bar for the landing page.
 * Contains brand logo, navigation links, and a CTA to the dashboard.
 */
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', active: true },
  { label: 'Sessions', href: '/dashboard' },
  { label: 'Stats', href: '/dashboard' },
  { label: 'About', href: '/' },
]

export function Navbar() {
  return (
    <nav className="relative z-50 w-full">
      <div className="flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <span
          className="text-3xl tracking-tight text-foreground select-none"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          DeepWork
        </span>

        {/* Nav Links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href || '#'}
                className={cn(
                  'text-sm transition-colors duration-200',
                  link.active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          to="/dashboard"
          className="liquid-glass inline-block rounded-full px-6 py-2.5 text-sm text-foreground transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
        >
          Start Focusing
        </Link>
      </div>
    </nav>
  )
}
