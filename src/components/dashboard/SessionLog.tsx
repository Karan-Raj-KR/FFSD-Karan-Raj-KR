// Lists all completed sessions with timestamps, durations, and a delete functionality.
import { Session } from '@/types';
import { Trash2Icon, BookOpenIcon, CheckCircle2Icon } from 'lucide-react';

interface SessionLogProps {
  sessions: Session[];
  onDelete: (id: string) => void;
}

export function SessionLog({ sessions, onDelete }: SessionLogProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    return `${mins} min`;
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-12 backdrop-blur-md flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground">
          <BookOpenIcon className="w-8 h-8 opacity-50" />
        </div>
        <div>
          <p className="text-foreground font-medium mb-1">No sessions completed yet</p>
          <p className="text-sm text-muted-foreground">Start a focus timer to log your first session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-xl text-foreground font-medium" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Recent Sessions
        </h3>
      </div>
      <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
        {sessions.map(s => (
          <div key={s.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{s.subject}</p>
                <p className="text-xs text-muted-foreground">{formatDate(s.timestamp)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">
                  {formatDuration(s.duration)}
                </span>
                <span className="text-xs text-yellow-500">
                  +{Math.floor(s.duration / 60)} XP
                </span>
              </div>
              <button 
                onClick={() => onDelete(s.id)}
                className="text-muted-foreground hover:text-red-400 transition-colors p-2 opacity-0 group-hover:opacity-100"
                title="Delete Session"
              >
                <Trash2Icon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
