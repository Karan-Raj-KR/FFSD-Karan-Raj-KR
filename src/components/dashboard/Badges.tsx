// Displays unlockable achievements based on focus history and streak.
import { useState, useEffect } from 'react';
import { Session } from '@/types';
import { LockIcon, AwardIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface BadgesProps {
  sessions: Session[];
  streak: number;
  xp: number;
}

export function Badges({ sessions, streak, xp }: BadgesProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const hasFirstSession = sessions.length > 0;
  const has3DayStreak = streak >= 3;
  const has7DayStreak = streak >= 7;
  const hasDeepDiver = sessions.some(s => s.duration >= 50 * 60);
  const hasCentury = xp >= 100;
  const hasThousand = xp >= 1000;
  
  const subjectCounts: Record<string, number> = {};
  sessions.forEach(s => { subjectCounts[s.subject] = (subjectCounts[s.subject] || 0) + 1; });
  const hasSubjectMaster = Object.values(subjectCounts).some(c => c >= 5);
  
  const hasNightOwl = sessions.some(s => {
    const d = new Date(s.timestamp);
    return d.getHours() >= 22 || d.getHours() < 4;
  });

  const BADGES = [
    { id: 'first', name: 'First Step', unlocked: hasFirstSession, desc: 'Complete first session' },
    { id: 'streak3', name: 'On a Roll', unlocked: has3DayStreak, desc: '3-day streak' },
    { id: 'streak7', name: 'Week Warrior', unlocked: has7DayStreak, desc: '7-day streak' },
    { id: 'deep', name: 'Deep Diver', unlocked: hasDeepDiver, desc: 'Single session of 50+ min' },
    { id: 'century', name: 'Century', unlocked: hasCentury, desc: '100 total XP earned' },
    { id: 'thousand', name: 'Thousand', unlocked: hasThousand, desc: '1000 total XP earned' },
    { id: 'master', name: 'Subject Master', unlocked: hasSubjectMaster, desc: '5+ sessions on same subject' },
    { id: 'night', name: 'Night Owl', unlocked: hasNightOwl, desc: 'Complete session after 10 PM' },
  ];

  useEffect(() => {
    const currentlyUnlocked = BADGES.filter(b => b.unlocked).map(b => b.id);
    
    if (unlockedBadges.length > 0) {
      const newUnlocks = currentlyUnlocked.filter(id => !unlockedBadges.includes(id));
      if (newUnlocks.length > 0) {
        const names = newUnlocks.map(id => BADGES.find(b => b.id === id)?.name).join(', ');
        setToastMessage(`Badge Unlocked: ${names}`);
        setTimeout(() => setToastMessage(null), 5000);
      }
    }
    
    setUnlockedBadges(currentlyUnlocked);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, sessions.length, streak]);

  return (
    <>
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-3">
          <AwardIcon className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md mt-8">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors text-left"
        >
          <div>
            <h3 className="text-xl text-foreground font-medium" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Achievements
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Unlock badges as you build your focus habit.</p>
          </div>
          {isOpen ? <ChevronUpIcon className="w-5 h-5 text-muted-foreground" /> : <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />}
        </button>
        
        {isOpen && (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BADGES.map(b => (
              <div 
                key={b.id} 
                className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all duration-500 ${
                  b.unlocked 
                    ? 'bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'bg-black/20 border-white/5 opacity-50 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${b.unlocked ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-muted-foreground'}`}>
                  {b.unlocked ? <AwardIcon className="w-6 h-6" /> : <LockIcon className="w-5 h-5" />}
                </div>
                <div>
                  <p className={`font-medium text-sm transition-colors duration-500 ${b.unlocked ? 'text-blue-400' : 'text-muted-foreground'}`}>{b.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
