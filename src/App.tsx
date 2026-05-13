import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LandingPage } from '@/pages/LandingPage'
import { Dashboard } from '@/pages/Dashboard'
import { Sessions } from '@/pages/Sessions'
import { Stats } from '@/pages/Stats'
import { About } from '@/pages/About'
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

  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('deepwork_xp');
    return saved ? parseInt(saved, 10) : 0;
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

  useEffect(() => {
    localStorage.setItem('deepwork_xp', xp.toString());
  }, [xp]);

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

    const today = new Date();
    today.setHours(0,0,0,0);
    const todayStr = today.toDateString();
    
    let currentStreak = streakData.streak;
    if (streakData.lastActiveDate !== todayStr) {
      if (streakData.lastActiveDate) {
        const last = new Date(streakData.lastActiveDate);
        last.setHours(0,0,0,0);
        const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) currentStreak++;
        else currentStreak = 1;
      } else {
        currentStreak = 1;
      }
    }

    const minutes = session.duration / 60;
    let earnedXp = Math.floor(minutes);
    if (currentStreak >= 7) earnedXp += 10;
    else if (currentStreak >= 3) earnedXp += 5;
    
    setXp(prev => prev + earnedXp);
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
              xp={xp}
              onAddSession={handleAddSession}
              onAddSubject={handleAddSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          } 
        />
        <Route
          path="/sessions"
          element={<Sessions sessions={sessions} subjects={subjects} onDeleteSession={handleDeleteSession} />}
        />
        <Route
          path="/stats"
          element={<Stats sessions={sessions} />}
        />
        <Route
          path="/about"
          element={<About />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
