import { useState, useEffect } from 'react';
import { Session } from '@/types';
import { VideoBackground } from '@/components/VideoBackground';
import { LevelBar } from '../components/dashboard/LevelBar';
import { Badges } from '../components/dashboard/Badges';
import { AmbientPlayer } from '../components/dashboard/AmbientPlayer';
import { Navbar } from '../components/Navbar';
import { PomodoroTimer } from '../components/dashboard/PomodoroTimer';
import { StatCards } from '../components/dashboard/StatCards';

interface DashboardProps {
  sessions: Session[];
  subjects: string[];
  streak: number;
  xp: number;
  onAddSession: (session: Omit<Session, 'id'>) => void;
  onAddSubject: (subject: string) => void;
  onDeleteSubject: (subject: string) => void;
}

export function Dashboard({ 
  sessions, 
  subjects, 
  streak,
  xp,
  onAddSession, 
  onAddSubject,
  onDeleteSubject
}: DashboardProps) {
  const [activeSubject, setActiveSubject] = useState(subjects[0] || 'Deep Work');
  const [isFocusRunning, setIsFocusRunning] = useState(false);

  // Make sure active subject is valid if subjects are deleted
  useEffect(() => {
    if (!subjects.includes(activeSubject) && subjects.length > 0) {
      setActiveSubject(subjects[0]);
    }
  }, [subjects, activeSubject]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <VideoBackground />
      
      <Navbar />
      
      <div className="relative z-10 flex flex-col p-6 md:p-12 max-w-7xl mx-auto w-full pt-12">
        <header className="mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl text-foreground font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Welcome back. Let's get focused.</p>
          </div>
        </header>

        <div className="space-y-8 pb-20">
          <StatCards sessions={sessions} streak={streak} />
          
          <LevelBar xp={xp} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <PomodoroTimer 
                activeSubject={activeSubject}
                onSessionComplete={(duration: number) => {
                  onAddSession({ subject: activeSubject, duration, timestamp: new Date().toISOString() })
                }}
                subjects={subjects}
                onAddSubject={onAddSubject}
                onDeleteSubject={onDeleteSubject}
                onSelectSubject={setActiveSubject}
                onTimerStateChange={(running, mode) => {
                  setIsFocusRunning(running && mode === 'focus');
                }}
              />
            </div>

            <div className="lg:col-span-1 space-y-8 mt-[-32px]">
              <Badges sessions={sessions} streak={streak} xp={xp} />
            </div>
          </div>
        </div>
      </div>
      
      <AmbientPlayer xp={xp} isFocusRunning={isFocusRunning} />
    </main>
  );
}
