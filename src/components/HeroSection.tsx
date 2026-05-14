/**
 * HeroSection.tsx
 * 
 * The main hero section of the landing page.
 * Displays the primary value proposition and a CTA to ENTER the dashboard.
 */
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-40 py-[90px]">
      {/* H1 — Cinematic Headline */}
      <h1
        className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.95] max-w-7xl text-foreground"
        style={{
          fontFamily: "'Instrument Serif', serif",
          letterSpacing: '-2.46px',
        }}
      >
        Where focus{' '}
        <em className="not-italic text-muted-foreground">becomes a habit.</em>
      </h1>

      {/* Subtext */}
      <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
        Built for students who take their time seriously. Track sessions, kill distractions, and watch your consistency compound.
      </p>

      {/* Hero CTA */}
      <Link
        to="/dashboard"
        className="animate-fade-rise-delay-2 liquid-glass inline-block rounded-full px-14 py-5 text-base text-foreground mt-12 transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
      >
        Start Focusing
      </Link>
    </section>
  )
}
