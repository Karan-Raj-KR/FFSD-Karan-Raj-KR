import { useState } from 'react';
import { Session } from '@/types';
import { VideoBackground } from '@/components/VideoBackground';
import { Navbar } from '@/components/Navbar';
import { SessionLog } from '@/components/dashboard/SessionLog';

interface SessionsProps {
  sessions: Session[];
  subjects: string[];
  onDeleteSession: (id: string) => void;
}

export function Sessions({ sessions, subjects, onDeleteSession }: SessionsProps) {
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterDate, setFilterDate] = useState('All Time');

  const filteredSessions = sessions.filter(s => {
    if (filterSubject !== 'All' && s.subject !== filterSubject) return false;
    
    if (filterDate === 'This Week') {
      const d = new Date(s.timestamp);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      if (diff > 7 * 24 * 60 * 60 * 1000) return false;
    } else if (filterDate === 'This Month') {
      const d = new Date(s.timestamp);
      const now = new Date();
      if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return false;
    }
    
    return true;
  });

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <VideoBackground />
      <Navbar />
      
      <div className="relative z-10 flex flex-col p-6 md:p-12 max-w-4xl mx-auto w-full pt-12">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl text-foreground font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Sessions
            </h1>
            <p className="text-muted-foreground mt-2">Track and review your focus history.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            
            <select 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All Time">All Time</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
        </header>

        <SessionLog sessions={filteredSessions} onDelete={onDeleteSession} />
      </div>
    </main>
  );
}
