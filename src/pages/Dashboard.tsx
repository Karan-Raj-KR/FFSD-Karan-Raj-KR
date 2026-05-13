import { useState } from 'react';
import { Transaction, Category } from '@/types';
import { StatCards } from '@/components/dashboard/StatCards';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { CategoryFilter } from '@/components/dashboard/CategoryFilter';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { MonthlyBarChart } from '@/components/dashboard/MonthlyBarChart';
import { VideoBackground } from '@/components/VideoBackground';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export function Dashboard({ transactions, onAddTransaction, onDeleteTransaction }: DashboardProps) {
  const [filter, setFilter] = useState<Category | 'All'>('All');

  const filteredTransactions = transactions
    .filter(t => filter === 'All' || t.category === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <VideoBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-12 max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between mb-8">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl text-foreground font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Dashboard
            </h1>
          </div>
        </header>

        <div className="space-y-8 pb-20">
          <StatCards transactions={transactions} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-foreground font-medium" style={{ fontFamily: "'Instrument Serif', serif" }}>Recent Transactions</h3>
                </div>
                <CategoryFilter selected={filter} onSelect={setFilter} />
                <TransactionList transactions={filteredTransactions} onDelete={onDeleteTransaction} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ExpenseChart transactions={transactions} />
                <MonthlyBarChart transactions={transactions} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <TransactionForm onAdd={onAddTransaction} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
