import React from 'react';
import { cn } from '../ui/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend 
} from 'recharts';

interface ZenBarChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>;
  title: string;
  className?: string;
}

export const ZenBarChart: React.FC<ZenBarChartProps> = ({ data, title, className }) => {
  return (
    <div className={cn('bg-white border border-[#E5E7EB] rounded-lg p-6', className)}>
      <h3 className="text-lg font-medium text-[#1F2937] mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <Bar dataKey="value" fill="#FF6A3D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface ZenPieChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  title: string;
  className?: string;
}

export const ZenPieChart: React.FC<ZenPieChartProps> = ({ data, title, className }) => {
  return (
    <div className={cn('bg-white border border-[#E5E7EB] rounded-lg p-6', className)}>
      <h3 className="text-lg font-medium text-[#1F2937] mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[#6B7280]">{item.name}</span>
            </div>
            <span className="font-medium text-[#1F2937]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};