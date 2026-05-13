import { Session } from '@/types';
import { VideoBackground } from '@/components/VideoBackground';
import { Navbar } from '@/components/Navbar';
import { WeeklyBarChart } from '@/components/dashboard/WeeklyBarChart';
import { SubjectDonutChart } from '@/components/dashboard/SubjectDonutChart';
import { ActivityIcon, ClockIcon, FlameIcon, BookOpenIcon } from 'lucide-react';

interface StatsProps {
  sessions: Session[];
}

export function Stats({ sessions }: StatsProps) {
  const totalSessions = sessions.length;
  const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);
  
  const subjectCounts: Record<string, number> = {};
  sessions.forEach(s => { subjectCounts[s.subject] = (subjectCounts[s.subject] || 0) + s.duration; });
  let mostStudied = 'None';
  let maxDur = 0;
  for (const [sub, dur] of Object.entries(subjectCounts)) {
    if (dur > maxDur) {
      mostStudied = sub;
      maxDur = dur;
    }
  }

  const uniqueDates = Array.from(new Set(
    sessions.map(s => new Date(s.timestamp).toDateString())
  )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let bestStreak = 0;
  if (uniqueDates.length > 0) {
    let currentStreak = 1;
    bestStreak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const d1 = new Date(uniqueDates[i]);
      const d2 = new Date(uniqueDates[i+1]);
      const diff = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
      if (diff === 1) {
        currentStreak++;
        if (currentStreak > bestStreak) bestStreak = currentStreak;
      } else {
        currentStreak = 1;
      }
    }
  }

  const statCards = [
    { label: 'Total Sessions', value: totalSessions.toString(), icon: ActivityIcon },
    { label: 'Focus Hours', value: totalHours, icon: ClockIcon },
    { label: 'Best Streak', value: `${bestStreak} days`, icon: FlameIcon },
    { label: 'Top Subject', value: mostStudied, icon: BookOpenIcon },
  ];

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <VideoBackground />
      <Navbar />
      
      <div className="relative z-10 flex flex-col p-6 md:p-12 max-w-6xl mx-auto w-full pt-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl text-foreground font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Your Stats
          </h1>
          <p className="text-muted-foreground mt-2">Analyze your focus trends and habits over time.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {statCards.map((c, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-4">
                <c.icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{c.label}</p>
              <h3 className="text-2xl text-foreground font-medium truncate">{c.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <WeeklyBarChart sessions={sessions} />
          <SubjectDonutChart sessions={sessions} />
        </div>
      </div>
    </main>
  );
}
