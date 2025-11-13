import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BodyMetric } from '../types';

interface BodyMetricsChartProps {
  metrics: BodyMetric[];
  isDarkMode?: boolean;
}

export const BodyMetricsChart: React.FC<BodyMetricsChartProps> = ({ metrics, isDarkMode = true }) => {
  const chartData = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const currentStart = new Date(currentYear, currentMonth - 2, 1);
    const currentEnd = new Date(currentYear, currentMonth + 1, 0);

    const previousStart = new Date(currentYear, currentMonth - 5, 1);
    const previousEnd = new Date(currentYear, currentMonth - 2, 0);

    const dataMap: { [date: string]: { date: string; weight?: number; muscleMass?: number; bodyFat?: number } } = {};

    metrics.forEach(metric => {
      const metricDate = new Date(metric.date);
      const bodyFatPercentage = metric.bodyFatPercentage || 0;
      
      const isCurrentPeriod = metricDate >= currentStart && metricDate <= currentEnd;
      const isPreviousPeriod = metricDate >= previousStart && metricDate <= previousEnd;

      if (isCurrentPeriod || isPreviousPeriod) {
        if (!dataMap[metric.date]) {
          dataMap[metric.date] = { date: metric.date };
        }
        dataMap[metric.date].weight = metric.weight;
        dataMap[metric.date].muscleMass = metric.muscleMass;
        dataMap[metric.date].bodyFat = bodyFatPercentage;
      }
    });

    return Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [metrics]);

  const gridColor = isDarkMode ? '#475569' : '#e5e7eb';
  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#475569' : '#e5e7eb';
  const tooltipText = isDarkMode ? '#f1f5f9' : '#1e293b';
  
  const weightColor = isDarkMode ? '#3b82f6' : '#0ea5e9';
  const muscleColor = isDarkMode ? '#10b981' : '#06b6d4';
  const fatColor = isDarkMode ? '#f59e0b' : '#f97316';

  if (chartData.length === 0) {
    return (
      <div className={`p-8 rounded-lg text-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
        <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
          Registra tu peso y masa muscular para ver el gráfico de evolución
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey="date"
          stroke={axisColor}
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke={axisColor}
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            color: tooltipText
          }}
          formatter={(value: number | undefined, name: string) => {
            if (value === undefined) return ['N/A', name];
            if (name === 'weight') return [`${value.toFixed(1)} kg`, 'Peso'];
            if (name === 'muscleMass') return [`${value.toFixed(1)} kg`, 'Músculo'];
            if (name === 'bodyFat') return [`${value.toFixed(1)}%`, 'Grasa'];
            return [value, name];
          }}
        />
        <Legend wrapperStyle={{ color: axisColor }} />
        
        <Line
          type="monotone"
          dataKey="weight"
          stroke={weightColor}
          strokeWidth={2.5}
          dot={{ fill: weightColor, r: 4 }}
          activeDot={{ r: 6 }}
          name="Peso (kg)"
          connectNulls
        />
        
        <Line
          type="monotone"
          dataKey="muscleMass"
          stroke={muscleColor}
          strokeWidth={2.5}
          dot={{ fill: muscleColor, r: 4 }}
          activeDot={{ r: 6 }}
          name="Masa Muscular (kg)"
          connectNulls
        />
        
        <Line
          type="monotone"
          dataKey="bodyFat"
          stroke={fatColor}
          strokeWidth={2.5}
          dot={{ fill: fatColor, r: 4 }}
          activeDot={{ r: 6 }}
          name="% Grasa"
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
