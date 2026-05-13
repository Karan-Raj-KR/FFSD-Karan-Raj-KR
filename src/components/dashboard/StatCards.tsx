import { Transaction } from '@/types';
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from 'lucide-react';

interface StatCardsProps {
  transactions: Transaction[];
}

export function StatCards({ transactions }: StatCardsProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      icon: <WalletIcon className="h-5 w-5 text-blue-400" />,
      color: balance >= 0 ? 'text-white' : 'text-red-400',
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: <ArrowUpIcon className="h-5 w-5 text-emerald-400" />,
      color: 'text-emerald-400',
    },
    {
      title: 'Total Expenses',
      amount: totalExpense,
      icon: <ArrowDownIcon className="h-5 w-5 text-red-400" />,
      color: 'text-red-400',
    },
  ];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md liquid-glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground text-sm font-medium">{card.title}</h3>
            <div className="p-2 bg-white/5 rounded-full">
              {card.icon}
            </div>
          </div>
          <p className={`text-3xl font-semibold tracking-tight ${card.color}`} style={{ fontFamily: "'Instrument Serif', serif" }}>
            {formatCurrency(card.amount)}
          </p>
        </div>
      ))}
    </div>
  );
}
