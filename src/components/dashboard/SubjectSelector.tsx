// Renders the subject dropdown, an input form to add new subjects, and a delete button.
import { useState } from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';

interface SubjectSelectorProps {
  activeSubject: string;
  subjects: string[];
  onSelectSubject: (s: string) => void;
  onAddSubject: (s: string) => void;
  onDeleteSubject: (s: string) => void;
  disabled: boolean;
}

export function SubjectSelector({
  activeSubject,
  subjects,
  onSelectSubject,
  onAddSubject,
  onDeleteSubject,
  disabled
}: SubjectSelectorProps) {
  const [newSubject, setNewSubject] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.trim()) {
      onAddSubject(newSubject.trim());
      onSelectSubject(newSubject.trim());
      setNewSubject('');
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <label htmlFor="activeSubject" className="sr-only">Select Subject</label>
        <select
          id="activeSubject"
          value={activeSubject}
          onChange={(e) => onSelectSubject(e.target.value)}
          disabled={disabled}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none disabled:opacity-50"
        >
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
          {subjects.length === 0 && <option value="" disabled>No subjects</option>}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <form onSubmit={handleAdd} className="flex-1 flex gap-2">
          <label htmlFor="newSubject" className="sr-only">New subject</label>
          <input
            id="newSubject"
            type="text"
            required
            placeholder="New subject..."
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            disabled={disabled}
            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newSubject.trim() || disabled}
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 text-foreground"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </form>
        <button
          onClick={() => onDeleteSubject(activeSubject)}
          disabled={disabled || subjects.length === 0}
          className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
          title="Delete current subject"
        >
          <Trash2Icon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
