import { useState, useEffect } from 'react';
import { Session } from '@/types';
import { VideoBackground } from '@/components/VideoBackground';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

import { PomodoroTimer } from '../components/dashboard/PomodoroTimer';
import { StatCards } from '../components/dashboard/StatCards';
import { SessionLog } from '../components/dashboard/SessionLog';
import { WeeklyBarChart } from '../components/dashboard/WeeklyBarChart';
import { SubjectDonutChart } from '../components/dashboard/SubjectDonutChart';

interface DashboardProps {
  sessions: Session[];
  subjects: string[];
  streak: number;
  onAddSession: (session: Omit<Session, 'id'>) => void;
  onDeleteSession: (id: string) => void;
  onAddSubject: (subject: string) => void;
  onDeleteSubject: (subject: string) => void;
}

export function Dashboard({ 
  sessions, 
  subjects, 
  streak,
  onAddSession, 
  onDeleteSession,
  onAddSubject,
  onDeleteSubject
}: DashboardProps) {
  const [activeSubject, setActiveSubject] = useState(subjects[0] || 'Deep Work');

  // Make sure active subject is valid if subjects are deleted
  useEffect(() => {
    if (!subjects.includes(activeSubject) && subjects.length > 0) {
      setActiveSubject(subjects[0]);
    }
  }, [subjects, activeSubject]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <VideoBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-12 max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between mb-8">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" /> ← Home
            </Link>
            <h1 className="text-4xl md:text-5xl text-foreground font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Dashboard
            </h1>
          </div>
        </header>

        <div className="space-y-8 pb-20">
          <StatCards sessions={sessions} streak={streak} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              />
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <WeeklyBarChart sessions={sessions} />
                <SubjectDonutChart sessions={sessions} />
              </div>

              <SessionLog sessions={sessions} onDelete={onDeleteSession} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
