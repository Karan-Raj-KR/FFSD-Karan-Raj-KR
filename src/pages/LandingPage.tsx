import { VideoBackground } from '@/components/VideoBackground'
import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'

export function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Fullscreen Video Background */}
      <VideoBackground />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <HeroSection />
      </div>
    </main>
  )
}
