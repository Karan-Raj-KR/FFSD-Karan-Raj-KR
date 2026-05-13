// Displays top-level metrics: total focus time, session count, and current active streak.
import { Session } from '@/types';
import { ClockIcon, ActivityIcon, FlameIcon } from 'lucide-react';

interface StatCardsProps {
  sessions: Session[];
  streak: number;
}

export function StatCards({ sessions, streak }: StatCardsProps) {
  const today = new Date().toDateString();
  
  const todaySessions = sessions.filter(s => new Date(s.timestamp).toDateString() === today);
  const totalSecondsToday = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  
  const hours = Math.floor(totalSecondsToday / 3600);
  const minutes = Math.floor((totalSecondsToday % 3600) / 60);
  const focusTimeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const cards = [
    {
      title: "Today's Focus Time",
      value: focusTimeString,
      icon: ClockIcon,
      color: "text-blue-400"
    },
    {
      title: "Sessions Today",
      value: todaySessions.length.toString(),
      icon: ActivityIcon,
      color: "text-emerald-400"
    },
    {
      title: "Current Streak",
      value: `${streak} days`,
      icon: FlameIcon,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
              <h3 className="text-3xl text-foreground font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {card.value}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${card.color.replace('text', 'bg')}`} />
        </div>
      ))}
    </div>
  );
}
