import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LandingPage } from '@/pages/LandingPage'
import { Dashboard } from '@/pages/Dashboard'
import { Session } from '@/types'

function App() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('deepwork_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [subjects, setSubjects] = useState<string[]>(() => {
    const saved = localStorage.getItem('deepwork_subjects');
    return saved ? JSON.parse(saved) : ['Deep Work', 'Reading', 'Coding'];
  });

  const [streakData, setStreakData] = useState<{streak: number, lastActiveDate: string | null}>(() => {
    const saved = localStorage.getItem('deepwork_streak');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.lastActiveDate) {
        const last = new Date(data.lastActiveDate);
        last.setHours(0,0,0,0);
        const today = new Date();
        today.setHours(0,0,0,0);
        const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 1) {
          return { streak: 0, lastActiveDate: null };
        }
      }
      return data;
    }
    return { streak: 0, lastActiveDate: null };
  });

  useEffect(() => {
    localStorage.setItem('deepwork_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('deepwork_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('deepwork_streak', JSON.stringify(streakData));
  }, [streakData]);

  const handleAddSession = (session: Omit<Session, 'id'>) => {
    const newSession = { ...session, id: crypto.randomUUID() };
    setSessions(prev => [newSession, ...prev]);

    setStreakData(prev => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const todayStr = today.toDateString();
      
      if (prev.lastActiveDate === todayStr) {
        return prev;
      }
      
      if (prev.lastActiveDate) {
        const last = new Date(prev.lastActiveDate);
        last.setHours(0,0,0,0);
        const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          return { streak: prev.streak + 1, lastActiveDate: todayStr };
        }
      }
      return { streak: 1, lastActiveDate: todayStr };
    });
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleAddSubject = (subject: string) => {
    if (!subjects.includes(subject)) {
      setSubjects(prev => [...prev, subject]);
    }
  };

  const handleDeleteSubject = (subject: string) => {
    setSubjects(prev => prev.filter(s => s !== subject));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              sessions={sessions}
              subjects={subjects}
              streak={streakData.streak}
              onAddSession={handleAddSession}
              onDeleteSession={handleDeleteSession}
              onAddSubject={handleAddSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
