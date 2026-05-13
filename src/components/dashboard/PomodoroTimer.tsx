// Main timer interface managing focus/break modes, SVG progress, and audio notifications.
import { useState, useEffect, useCallback } from 'react';
import { PlayIcon, PauseIcon, RotateCcwIcon } from 'lucide-react';
import { SubjectSelector } from './SubjectSelector';
import { TimerMode } from '@/types';

interface PomodoroTimerProps {
  activeSubject: string;
  subjects: string[];
  onSelectSubject: (s: string) => void;
  onAddSubject: (s: string) => void;
  onDeleteSubject: (s: string) => void;
  onSessionComplete: (durationSeconds: number) => void;
}

const MODES: Record<TimerMode, { label: string; duration: number }> = {
  focus: { label: 'Focus', duration: 25 * 60 },
  shortBreak: { label: 'Short Break', duration: 5 * 60 },
  longBreak: { label: 'Long Break', duration: 15 * 60 },
};

export function PomodoroTimer({
  activeSubject,
  subjects,
  onSelectSubject,
  onAddSubject,
  onDeleteSubject,
  onSessionComplete
}: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [warning, setWarning] = useState('');

  const playBeep = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio API error", e);
    }
  }, []);

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playBeep();
      if (mode === 'focus') {
        onSessionComplete(MODES.focus.duration);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, onSessionComplete, playBeep]);

  useEffect(() => {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    document.title = `${mins}:${secs} — ${MODES[mode].label} | DeepWork`;
    
    return () => {
      document.title = 'DeepWork — Where focus becomes a habit.';
    };
  }, [timeLeft, mode]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(MODES[mode].duration);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    if (!isRunning && !activeSubject && mode === 'focus') {
      setWarning('Please select a subject first');
      return;
    }
    setWarning('');
    if (timeLeft === 0) {
      handleReset();
    }
    setIsRunning(!isRunning);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - (timeLeft / MODES[mode].duration);

  // Circle SVG properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-md flex flex-col items-center">
      
      <div className="flex bg-black/30 rounded-full p-1 mb-8 w-full max-w-sm border border-white/5">
        {(Object.entries(MODES) as [TimerMode, typeof MODES[TimerMode]][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => handleModeChange(key)}
            className={`flex-1 py-2 text-sm rounded-full transition-all ${
              mode === key 
                ? 'bg-white/10 text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            className="stroke-white/5"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            className={`transition-all duration-1000 ease-linear ${mode === 'focus' ? 'stroke-blue-400' : 'stroke-emerald-400'}`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="flex flex-col items-center justify-center relative z-10">
          <span className="text-sm font-medium text-muted-foreground mb-2 px-3 py-1 rounded-full bg-black/20 border border-white/5 truncate max-w-[140px]">
            {activeSubject || 'No Subject'}
          </span>
          <h2 
            className="text-6xl text-foreground font-normal tracking-tighter"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={toggleTimer}
          className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isRunning ? <PauseIcon className="w-6 h-6 fill-current" /> : <PlayIcon className="w-6 h-6 fill-current ml-1" />}
        </button>
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-foreground flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <RotateCcwIcon className="w-5 h-5" />
        </button>
      </div>

      {warning && (
        <p className="text-red-400 text-sm mb-4 animate-pulse">{warning}</p>
      )}

      <div className="w-full max-w-sm pt-6 border-t border-white/10">
        <SubjectSelector 
          activeSubject={activeSubject}
          subjects={subjects}
          onSelectSubject={onSelectSubject}
          onAddSubject={onAddSubject}
          onDeleteSubject={onDeleteSubject}
          disabled={isRunning}
        />
      </div>
    </div>
  );
}
