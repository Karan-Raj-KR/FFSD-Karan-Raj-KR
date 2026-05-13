// Floating ambient sound player — uses HTML5 Audio API with local MP3 files.
import { useState, useEffect, useRef } from 'react';
import { Volume2Icon, VolumeXIcon, MusicIcon, LockIcon } from 'lucide-react';

interface AmbientPlayerProps {
  xp: number;
  isFocusRunning: boolean;
}

const SOUNDS = [
  { id: 'rain',       label: 'Rain',        src: '/rain.mp3',       unlockXP: 0   },
  { id: 'study',      label: 'Study Waves', src: '/study.mp3',      unlockXP: 100 },
  { id: 'whitenoise', label: 'White Noise', src: '/whitenoise.mp3', unlockXP: 300 },
];

// Audio elements created once at module scope — synchronously available in every handler.
const AUDIOS: Record<string, HTMLAudioElement> = {};
SOUNDS.forEach(s => {
  const a = new Audio(s.src);
  a.loop   = true;
  a.volume = 0.5;
  AUDIOS[s.id] = a;
});

const pauseAll = () => Object.values(AUDIOS).forEach(a => a.pause());

export function AmbientPlayer({ xp, isFocusRunning }: AmbientPlayerProps) {
  const [isOpen,    setIsOpen]    = useState(false);
  const [activeId,  setActiveId]  = useState<string>(
    () => localStorage.getItem('deepwork_ambient') ?? 'rain'
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume,    setVolume]    = useState(0.5);
  const prevFocusRef = useRef(isFocusRunning);

  // Keep all audio volumes in sync
  useEffect(() => {
    Object.values(AUDIOS).forEach(a => { a.volume = volume; });
  }, [volume]);

  // Persist selected sound
  useEffect(() => {
    localStorage.setItem('deepwork_ambient', activeId);
  }, [activeId]);

  // React to focus timer transitions only (detect actual changes via ref)
  useEffect(() => {
    const wasRunning = prevFocusRef.current;
    prevFocusRef.current = isFocusRunning;

    if (!isFocusRunning && wasRunning) {
      // Timer just stopped/paused → pause audio
      pauseAll();
    } else if (isFocusRunning && !wasRunning && isPlaying) {
      // Timer just started and user already pressed play → resume
      AUDIOS[activeId]?.play().catch(() => {});
    }
  }, [isFocusRunning, isPlaying, activeId]);

  const handleTogglePlay = () => {
    if (!isFocusRunning) return; // only during focus
    if (isPlaying) {
      pauseAll();
      setIsPlaying(false);
    } else {
      pauseAll();
      AUDIOS[activeId]?.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSelectSound = (id: string) => {
    pauseAll();
    setActiveId(id);
    if (isPlaying && isFocusRunning) {
      setTimeout(() => AUDIOS[id]?.play().catch(() => {}), 10);
    }
  };

  const liveAudio   = isPlaying && isFocusRunning;
  const activeLabel = SOUNDS.find(s => s.id === activeId)?.label ?? '';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl" style={{ minWidth: 220 }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Ambient</span>
            <button
              onClick={handleTogglePlay}
              disabled={!isFocusRunning}
              title={!isFocusRunning ? 'Start a focus session first' : liveAudio ? 'Pause' : 'Play'}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {liveAudio ? <span className="text-[10px] font-bold">■</span> : <span className="text-[10px] font-bold ml-0.5">▶</span>}
            </button>
          </div>

          <div className="space-y-1 mb-3">
            {SOUNDS.map(s => {
              const unlocked = xp >= s.unlockXP;
              const isActive = activeId === s.id;
              const isLive   = isActive && liveAudio;
              return (
                <button
                  key={s.id}
                  disabled={!unlocked}
                  onClick={() => unlocked && handleSelectSound(s.id)}
                  className={[
                    'w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between transition-all duration-200',
                    isActive ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' : 'border border-transparent hover:bg-white/5 text-foreground',
                    !unlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                  ].join(' ')}
                >
                  <span>{s.label}</span>
                  {!unlocked ? (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <LockIcon className="w-3 h-3" />{s.unlockXP} XP
                    </span>
                  ) : isLive ? (
                    <span className="flex gap-0.5 items-end h-3.5 shrink-0">
                      {[0.6, 1, 0.7].map((h, i) => (
                        <span key={i} className="w-0.5 bg-blue-400 rounded-full"
                          style={{ height: `${h * 100}%`, animation: `ambientPulse 0.8s ${i * 0.22}s ease-in-out infinite alternate` }} />
                      ))}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            {volume === 0 ? <VolumeXIcon className="w-4 h-4 shrink-0" /> : <Volume2Icon className="w-4 h-4 shrink-0" />}
            <input type="range" min={0} max={1} step={0.01} value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 accent-blue-400 bg-white/10 rounded-lg appearance-none cursor-pointer" />
          </div>

          {!isFocusRunning && (
            <p className="text-xs text-muted-foreground/50 mt-3 text-center leading-tight">
              Start a focus session to enable sound
            </p>
          )}
        </div>
      )}

      <button onClick={() => setIsOpen(o => !o)} title={`Ambient: ${activeLabel}`}
        className={['w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105',
          liveAudio ? 'bg-blue-500 text-white shadow-blue-500/30' : 'bg-zinc-800 border border-white/10 text-muted-foreground hover:text-foreground'].join(' ')}>
        <MusicIcon className="w-6 h-6" />
      </button>

      <style>{`@keyframes ambientPulse { from { transform:scaleY(0.4); } to { transform:scaleY(1); } }`}</style>
    </div>
  );
}
