// Visualizes the distribution of total focus time across different subjects.
import { Session } from '@/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface SubjectDonutChartProps {
  sessions: Session[];
}

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#f87171'];

export function SubjectDonutChart({ sessions }: SubjectDonutChartProps) {
  const subjectHours: Record<string, number> = {};
  sessions.forEach(s => {
    if (!subjectHours[s.subject]) subjectHours[s.subject] = 0;
    subjectHours[s.subject] += s.duration;
  });

  const data = Object.keys(subjectHours).map(subject => ({
    name: subject,
    value: Number((subjectHours[subject] / 3600).toFixed(2))
  })).filter(d => d.value > 0);

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col h-full min-h-[300px]">
      <h3 className="text-xl text-foreground font-medium mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
        Time by Subject (Hours)
      </h3>
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          No data to display.
        </div>
      ) : (
        <div className="flex-1 w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
