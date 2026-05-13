import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: Category | 'All';
  onSelect: (category: Category | 'All') => void;
}

const CATEGORIES: (Category | 'All')[] = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Other'];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {CATEGORIES.map(c => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={cn(
            'px-4 py-1.5 rounded-full text-sm transition-all duration-200 border',
            selected === c
              ? 'bg-foreground text-background border-foreground'
              : 'bg-zinc-900/50 text-muted-foreground border-white/10 hover:border-white/20 hover:text-foreground'
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
