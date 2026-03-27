'use client';

import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: Array<{ x: string | number; y: number }>; 
  title?: string;
  color?: string;
  height?: number;
}

const DEFAULT_COLOR = '#0284c7';

export function Chart({ type, data, title, color = DEFAULT_COLOR, height = 300 }: ChartProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {title && <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="y" fill={color} />
            </BarChart>
          )}

          {type === 'line' && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke={color} strokeWidth={2} />
            </LineChart>
          )}

          {type === 'area' && (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="y" stroke={color} fill={color} />
            </AreaChart>
          )}

          {type === 'pie' && (
            <PieChart>
              <Tooltip />
              <Pie data={data} dataKey="y" nameKey="x" cx="50%" cy="50%" outerRadius={height / 3} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || color} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
