import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', active: true },
  { label: 'Transactions', href: '#' },
  { label: 'Analytics', href: '#' },
  { label: 'About', href: '#' },
]

export function Navbar() {
  return (
    <nav className="relative z-10 w-full">
      <div className="flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <span
          className="text-3xl tracking-tight text-foreground select-none"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Spendly
        </span>

        {/* Nav Links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href || '#'}
                className={cn(
                  'text-sm transition-colors duration-200',
                  link.active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href="/dashboard"
          className="liquid-glass inline-block rounded-full px-6 py-2.5 text-sm text-foreground transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
        >
          Open Dashboard
        </a>
      </div>
    </nav>
  )
}
