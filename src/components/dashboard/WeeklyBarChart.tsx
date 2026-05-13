// Renders a bar chart showing hours of focus time over the last 7 rolling days.
import { Session } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyBarChartProps {
  sessions: Session[];
}

export function WeeklyBarChart({ sessions }: WeeklyBarChartProps) {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    
    const daySessions = sessions.filter(s => {
      const sd = new Date(s.timestamp);
      sd.setHours(0,0,0,0);
      return sd.getTime() === d.getTime();
    });
    
    const hours = daySessions.reduce((acc, s) => acc + s.duration, 0) / 3600;
    
    data.push({
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: Number(hours.toFixed(1))
    });
  }

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <h3 className="text-xl text-foreground font-medium mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
        Weekly Focus
      </h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#60a5fa' }}
            />
            <Bar dataKey="hours" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
