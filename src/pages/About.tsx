import { VideoBackground } from '@/components/VideoBackground';
import { Navbar } from '@/components/Navbar';
import { TargetIcon, PlayIcon, ZapIcon, AwardIcon, LockIcon, MusicIcon, FlameIcon } from 'lucide-react';

const LEVELS = [
  { name: 'Novice',      range: '0 – 50 XP' },
  { name: 'Apprentice',  range: '51 – 150 XP' },
  { name: 'Scholar',     range: '151 – 300 XP' },
  { name: 'Adept',       range: '301 – 500 XP' },
  { name: 'Focused',     range: '501 – 800 XP' },
  { name: 'Disciplined', range: '801 – 1200 XP' },
  { name: 'Sage',        range: '1201 – 1800 XP' },
  { name: 'Zenith',      range: '1800+ XP' },
];

const BADGES = [
  { name: 'First Step',     desc: 'Complete your first session' },
  { name: 'On a Roll',      desc: '3-day study streak' },
  { name: 'Week Warrior',   desc: '7-day study streak' },
  { name: 'Deep Diver',     desc: 'Single session of 50+ min' },
  { name: 'Century',        desc: '100 total XP earned' },
  { name: 'Thousand',       desc: '1000 total XP earned' },
  { name: 'Subject Master', desc: '5+ sessions on same subject' },
  { name: 'Night Owl',      desc: 'Complete a session after 10 PM' },
];

const SOUNDS = [
  { name: 'Rain',        xp: 0,    note: 'Always unlocked' },
  { name: 'Study Waves', xp: 100,  note: 'Unlock at 100 XP' },
  { name: 'White Noise', xp: 300,  note: 'Unlock at 300 XP' },
];

export function About() {
  const steps = [
    { title: 'Pick a Subject', desc: 'Organize your focus time by categorizing what you are working on.', icon: TargetIcon },
    { title: 'Start the Timer', desc: 'Commit to a focus block (default 25 min, fully editable). Breaks are built in.', icon: PlayIcon },
    { title: 'Earn XP & Level Up', desc: 'Every minute focused earns XP. Streak bonuses multiply your gains.', icon: ZapIcon },
  ];

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <VideoBackground />
      <Navbar />

      <div className="relative z-10 flex flex-col p-6 md:p-12 max-w-4xl mx-auto w-full pt-12 md:pt-20 pb-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl text-foreground font-normal tracking-tight mb-4"
            style={{ fontFamily: "'Instrument Serif', serif" }}>
            DeepWork
          </h1>
          <p className="text-xl md:text-2xl text-blue-400 font-medium mb-6">Where focus becomes a habit.</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A Pomodoro-based study tracker built for students who take their time seriously.
            Track sessions, earn XP, unlock rewards, and build a streak you're proud of.
          </p>
        </div>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-2xl text-foreground font-medium mb-8 text-center"
            style={{ fontFamily: "'Instrument Serif', serif" }}>How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground mb-6">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                <div className="absolute -bottom-8 -right-8 text-9xl font-bold text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* XP & Levels */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
              <ZapIcon className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl text-foreground font-medium" style={{ fontFamily: "'Instrument Serif', serif" }}>
                XP &amp; Levels
              </h2>
              <p className="text-sm text-muted-foreground">Every minute of focus earns you 1 XP.</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Streak Bonuses</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 flex-1">
                <FlameIcon className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">3-day streak</p>
                  <p className="text-xs text-muted-foreground">+5 bonus XP per session</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 flex-1">
                <FlameIcon className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">7-day streak</p>
                  <p className="text-xs text-muted-foreground">+10 bonus XP per session</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">8 Levels to climb</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LEVELS.map((l, i) => (
                <div key={i} className="bg-white/5 rounded-xl px-3 py-2">
                  <p className="text-sm font-medium text-foreground">{l.name}</p>
                  <p className="text-xs text-yellow-500/80 mt-0.5">{l.range}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <AwardIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl text-foreground font-medium" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Achievement Badges
              </h2>
              <p className="text-sm text-muted-foreground">Unlocked automatically as you hit milestones.</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGES.map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <AwardIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/60 mt-4 text-center">
              Locked badges appear greyed out with a lock icon. A toast notification fires the moment you unlock one.
            </p>
          </div>
        </section>

        {/* Ambient Sounds */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MusicIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl text-foreground font-medium" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Ambient Sounds
              </h2>
              <p className="text-sm text-muted-foreground">Focus music unlocked by reaching XP thresholds.</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="space-y-3">
              {SOUNDS.map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    {s.xp === 0
                      ? <MusicIcon className="w-4 h-4 text-emerald-400" />
                      : <LockIcon className="w-4 h-4 text-muted-foreground" />}
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${s.xp === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-muted-foreground'}`}>
                    {s.note}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/60 mt-4 text-center">
              Ambient sounds auto-pause when your focus timer stops and resume when it starts.
            </p>
          </div>
        </section>

        {/* Tech stack */}
        <div className="text-center">
          <div className="inline-block bg-white/5 border border-white/10 rounded-full px-6 py-2 text-sm text-muted-foreground">
            Built with React, Recharts, and the HTML5 Audio API
          </div>
        </div>
      </div>
    </main>
  );
}
