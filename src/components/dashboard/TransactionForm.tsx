import { useState } from 'react';
import { TransactionType, Category } from '@/types';

interface TransactionFormProps {
  onAdd: (transaction: { description: string; amount: number; type: TransactionType; category: Category; date: string }) => void;
}

const CATEGORIES: Category[] = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Other'];

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description || !amount || !date) {
      setError('All fields are required.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    onAdd({
      description,
      amount: numAmount,
      type,
      category,
      date,
    });

    setDescription('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
      <h3 className="text-xl text-foreground font-medium mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Add Transaction</h3>
      
      {error && <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground ml-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as TransactionType)} className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground ml-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground ml-1">Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Grocery shopping" className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground ml-1">Amount (₹)</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/20" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground ml-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20" style={{ colorScheme: 'dark' }} />
        </div>
      </div>

      <button type="submit" className="liquid-glass rounded-xl px-6 py-3 text-sm text-foreground mt-2 transition-transform duration-200 hover:scale-[1.02]">
        Save Transaction
      </button>
    </form>
  );
}
