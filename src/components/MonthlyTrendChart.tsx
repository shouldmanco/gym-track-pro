import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Workout } from '../types';

interface MonthlyTrendChartProps {
  workouts: Workout[];
  currentDate: Date;
  isDarkMode?: boolean;
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ workouts, currentDate, isDarkMode = true }) => {
  const chartData = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const getWeekNumber = (date: Date): number => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const timeDiff = d.getTime() - yearStart.getTime();
      return Math.ceil(((timeDiff / 86400000) + 1) / 7);
    };

    const getYearWeek = (date: Date): string => {
      return `${date.getFullYear()}-W${String(getWeekNumber(date)).padStart(2, '0')}`;
    };

    const data: { [key: string]: { week: string; current: number; previous: number } } = {};

    const currentStart = new Date(currentYear, currentMonth - 2, 1);
    const currentEnd = new Date(currentYear, currentMonth + 1, 0);

    const previousStart = new Date(currentYear, currentMonth - 5, 1);
    const previousEnd = new Date(currentYear, currentMonth - 2, 0);

    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      if (workoutDate >= currentStart && workoutDate <= currentEnd) {
        const weekKey = getYearWeek(workoutDate);
        if (!data[weekKey]) {
          data[weekKey] = { week: weekKey, current: 0, previous: 0 };
        }
        data[weekKey].current += 1;
      }
    });

    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      if (workoutDate >= previousStart && workoutDate <= previousEnd) {
        const weekNum = getWeekNumber(workoutDate);
        const currentWeekKey = `${currentYear}-W${String(weekNum).padStart(2, '0')}`;
        
        if (!data[currentWeekKey]) {
          data[currentWeekKey] = { week: currentWeekKey, current: 0, previous: 0 };
        }
        data[currentWeekKey].previous += 1;
      }
    });

    return Object.values(data)
      .sort((a, b) => a.week.localeCompare(b.week))
      .map(d => ({
        ...d,
        weekDisplay: `Sem ${d.week.split('-W')[1]}`
      }));
  }, [workouts, currentDate]);

  const gridColor = isDarkMode ? '#475569' : '#e2e8f0';
  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#475569' : '#e2e8f0';
  const tooltipText = isDarkMode ? '#f1f5f9' : '#1e293b';
  const currentLineColor = isDarkMode ? '#10b981' : '#0ea5e9';
  const previousLineColor = isDarkMode ? '#8b5cf6' : '#f59e0b';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey="weekDisplay" 
          stroke={axisColor}
          style={{ fontSize: '12px', fill: axisColor }}
        />
        <YAxis 
          stroke={axisColor}
          style={{ fontSize: '12px', fill: axisColor }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            color: tooltipText
          }}
          formatter={(value: number) => [`${value} entrenamientos`, '']}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px', color: axisColor }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="current"
          stroke={currentLineColor}
          strokeWidth={3}
          dot={{ fill: currentLineColor, r: 5 }}
          activeDot={{ r: 7 }}
          name="Últimos 3 meses"
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="previous"
          stroke={previousLineColor}
          strokeWidth={3}
          dot={{ fill: previousLineColor, r: 5 }}
          activeDot={{ r: 7 }}
          name="3 meses anteriores"
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
