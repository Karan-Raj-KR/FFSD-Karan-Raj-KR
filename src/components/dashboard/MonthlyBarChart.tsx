import { Transaction } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyBarChartProps {
  transactions: Transaction[];
}

export function MonthlyBarChart({ transactions }: MonthlyBarChartProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md h-[350px] flex items-center justify-center">
        <p className="text-muted-foreground">No data to display.</p>
      </div>
    );
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dataMap = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { name: monthYear, income: 0, expense: 0, date: date.getTime() };
    }
    
    if (t.type === 'income') {
      acc[monthYear].income += t.amount;
    } else {
      acc[monthYear].expense += t.amount;
    }
    
    return acc;
  }, {} as Record<string, { name: string, income: number, expense: number, date: number }>);

  const data = Object.values(dataMap).sort((a, b) => a.date - b.date).slice(-6); // Last 6 months

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col h-[350px]">
      <h3 className="text-xl text-foreground font-medium mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>Income vs Expenses</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
            <Tooltip
              formatter={(value: any) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}
              contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="income" name="Income" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
