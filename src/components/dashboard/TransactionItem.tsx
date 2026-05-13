import { Transaction } from '@/types';
import { Trash2Icon, UtensilsIcon, CarIcon, FileTextIcon, MonitorPlayIcon, ShoppingBagIcon, SparklesIcon } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getIcon = () => {
    switch (transaction.category) {
      case 'Food': return <UtensilsIcon className="w-4 h-4" />;
      case 'Transport': return <CarIcon className="w-4 h-4" />;
      case 'Bills': return <FileTextIcon className="w-4 h-4" />;
      case 'Entertainment': return <MonitorPlayIcon className="w-4 h-4" />;
      case 'Shopping': return <ShoppingBagIcon className="w-4 h-4" />;
      default: return <SparklesIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground">
          {getIcon()}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{transaction.description}</p>
          <p className="text-xs text-muted-foreground">{transaction.category} • {formatDate(transaction.date)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`text-sm font-medium ${transaction.type === 'income' ? 'text-emerald-400' : 'text-foreground'}`}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
        <button 
          onClick={() => onDelete(transaction.id)}
          className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"
        >
          <Trash2Icon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
