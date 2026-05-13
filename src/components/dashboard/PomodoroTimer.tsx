// Main timer interface managing focus/break modes, SVG progress, editable duration, and audio notifications.
import { useState, useEffect, useCallback, useRef } from 'react';
import { PlayIcon, PauseIcon, RotateCcwIcon, PencilIcon, CheckIcon } from 'lucide-react';
import { SubjectSelector } from './SubjectSelector';
import { TimerMode } from '@/types';

interface PomodoroTimerProps {
  activeSubject: string;
  subjects: string[];
  onSelectSubject: (s: string) => void;
  onAddSubject: (s: string) => void;
  onDeleteSubject: (s: string) => void;
  onSessionComplete: (durationSeconds: number) => void;
  onTimerStateChange: (isRunning: boolean, mode: TimerMode) => void;
}

const DEFAULT_DURATIONS: Record<TimerMode, number> = {
  focus:      25 * 60,
  shortBreak: 5  * 60,
  longBreak:  15 * 60,
};

const MODE_LABELS: Record<TimerMode, string> = {
  focus:      'Focus',
  shortBreak: 'Short Break',
  longBreak:  'Long Break',
};

export function PomodoroTimer({
  activeSubject,
  subjects,
  onSelectSubject,
  onAddSubject,
  onDeleteSubject,
  onSessionComplete,
  onTimerStateChange
}: PomodoroTimerProps) {
  const [mode,        setMode]        = useState<TimerMode>('focus');
  // Custom durations per mode (in seconds), editable
  const [durations,   setDurations]   = useState<Record<TimerMode, number>>(DEFAULT_DURATIONS);
  const [timeLeft,    setTimeLeft]    = useState(DEFAULT_DURATIONS.focus);
  const [isRunning,   setIsRunning]   = useState(false);
  const [warning,     setWarning]     = useState('');
  // Edit mode for the timer face
  const [isEditing,   setIsEditing]   = useState(false);
  const [editMinutes, setEditMinutes] = useState('25');
  const editInputRef = useRef<HTMLInputElement>(null);
  // Track actual session start duration for XP calculation
  const sessionDurationRef = useRef(DEFAULT_DURATIONS.focus);

  useEffect(() => {
    onTimerStateChange(isRunning, mode);
  }, [isRunning, mode, onTimerStateChange]);

  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx  = new AudioCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch (_) {}
  }, []);

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playBeep();
      if (mode === 'focus') {
        onSessionComplete(sessionDurationRef.current);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, onSessionComplete, playBeep]);

  useEffect(() => {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    document.title = `${mins}:${secs} — ${MODE_LABELS[mode]} | DeepWork`;
    return () => { document.title = 'DeepWork — Where focus becomes a habit.'; };
  }, [timeLeft, mode]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
    setIsEditing(false);
    sessionDurationRef.current = durations[newMode];
  };

  const handleReset = () => {
    setTimeLeft(durations[mode]);
    setIsRunning(false);
    setIsEditing(false);
    sessionDurationRef.current = durations[mode];
  };

  const toggleTimer = () => {
    if (!isRunning && !activeSubject && mode === 'focus') {
      setWarning('Please select a subject first');
      return;
    }
    setWarning('');
    if (isEditing) return; // don't start while editing
    if (timeLeft === 0) handleReset();
    setIsRunning(r => !r);
  };

  // ── Edit duration ──────────────────────────────────────────
  const openEdit = () => {
    if (isRunning) return; // can't edit while running
    setIsEditing(true);
    setEditMinutes(String(Math.floor(durations[mode] / 60)));
    setTimeout(() => editInputRef.current?.select(), 30);
  };

  const commitEdit = () => {
    const mins = Math.max(1, Math.min(180, parseInt(editMinutes) || 1));
    const secs = mins * 60;
    setDurations(prev => ({ ...prev, [mode]: secs }));
    setTimeLeft(secs);
    sessionDurationRef.current = secs;
    setIsEditing(false);
  };

  const handleEditKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setIsEditing(false);
  };
  // ──────────────────────────────────────────────────────────

  const minutes    = Math.floor(timeLeft / 60);
  const seconds    = timeLeft % 60;
  const totalSecs  = durations[mode];
  const progress   = 1 - timeLeft / totalSecs;
  const radius     = 120;
  const circ       = 2 * Math.PI * radius;
  const dashOffset = circ - progress * circ;

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-md flex flex-col items-center">
      
      {/* Mode tabs */}
      <div className="flex bg-black/30 rounded-full p-1 mb-8 w-full max-w-sm border border-white/5">
        {(Object.keys(DEFAULT_DURATIONS) as TimerMode[]).map(key => (
          <button
            key={key}
            onClick={() => handleModeChange(key)}
            className={`flex-1 py-2 text-sm rounded-full transition-all ${
              mode === key
                ? 'bg-white/10 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            {MODE_LABELS[key]}
          </button>
        ))}
      </div>

      {/* SVG circle + timer face */}
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="128" cy="128" r={radius} className="stroke-white/5" strokeWidth="8" fill="transparent" />
          <circle
            cx="128" cy="128" r={radius}
            className={`transition-all duration-1000 ease-linear ${mode === 'focus' ? 'stroke-blue-400' : 'stroke-emerald-400'}`}
            strokeWidth="8" fill="transparent"
            strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round"
          />
        </svg>

        <div className="flex flex-col items-center justify-center relative z-10 gap-2">
          <span className="text-sm font-medium text-muted-foreground px-3 py-1 rounded-full bg-black/20 border border-white/5 truncate max-w-[140px]">
            {activeSubject || 'No Subject'}
          </span>

          {/* Editable timer display */}
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                ref={editInputRef}
                type="number"
                min={1} max={180}
                value={editMinutes}
                onChange={e => setEditMinutes(e.target.value)}
                onKeyDown={handleEditKey}
                className="w-20 text-4xl text-center bg-transparent border-b-2 border-blue-400 text-foreground outline-none font-normal"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              />
              <span className="text-xl text-muted-foreground">min</span>
              <button onClick={commitEdit} className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500/30 transition-colors">
                <CheckIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openEdit}
              disabled={isRunning}
              title={isRunning ? 'Stop timer to edit' : 'Click to edit duration'}
              className="group flex items-center gap-2 text-6xl text-foreground font-normal tracking-tighter disabled:cursor-default"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              {!isRunning && (
                <PencilIcon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity mt-2 shrink-0" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={toggleTimer}
          className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isRunning
            ? <PauseIcon className="w-6 h-6 fill-current" />
            : <PlayIcon  className="w-6 h-6 fill-current ml-1" />}
        </button>
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-foreground flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <RotateCcwIcon className="w-5 h-5" />
        </button>
      </div>

      {warning && <p className="text-red-400 text-sm mb-4 animate-pulse">{warning}</p>}

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
