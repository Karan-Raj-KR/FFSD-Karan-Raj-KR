/**
 * Navbar.tsx
 * 
 * Top navigation bar for the landing page.
 * Contains brand logo, navigation links, and a CTA to the dashboard.
 */
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

import { useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Sessions', href: '/sessions' },
  { label: 'Stats', href: '/stats' },
  { label: 'About', href: '/about' },
]

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="relative z-50 w-full">
      <div className="flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl tracking-tight text-foreground select-none"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          DeepWork
        </Link>

        {/* Nav Links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className={cn(
                    'text-sm transition-colors duration-200',
                    isActive
                      ? 'text-blue-400 border-b border-blue-400 pb-1'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

      </div>
    </nav>
  )
}
