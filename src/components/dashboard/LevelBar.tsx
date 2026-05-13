// Displays the current user level and an XP progress bar.
import { ZapIcon } from 'lucide-react';

export function LevelBar({ xp }: { xp: number }) {
  const LEVELS = [
    { name: 'Novice', max: 50 },
    { name: 'Apprentice', max: 150 },
    { name: 'Scholar', max: 300 },
    { name: 'Adept', max: 500 },
    { name: 'Focused', max: 800 },
    { name: 'Disciplined', max: 1200 },
    { name: 'Sage', max: 1800 },
    { name: 'Zenith', max: Infinity },
  ];

  let currentLevelIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp <= LEVELS[i].max) {
      currentLevelIndex = i;
      break;
    }
  }

  const currentLevel = LEVELS[currentLevelIndex];
  const prevMax = currentLevelIndex > 0 ? LEVELS[currentLevelIndex - 1].max : 0;
  const levelXp = xp - prevMax;
  const levelTarget = currentLevel.max - prevMax;
  const progress = currentLevel.max === Infinity ? 100 : Math.min(100, Math.max(0, (levelXp / levelTarget) * 100));

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
        <ZapIcon className="w-6 h-6 fill-current" />
      </div>
      <div className="flex-1 w-full">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-sm text-muted-foreground">Current Level</p>
            <h3 className="text-xl font-medium text-foreground">{currentLevel.name}</h3>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {currentLevel.max === Infinity ? `${xp} XP` : `${xp} / ${currentLevel.max} XP`}
          </div>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
