import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Workout, WorkoutType, WorkoutDuration } from '../types';
import { WORKOUT_TYPES } from '../constants';
import { getWeekRange } from '../utils/date';

interface WeeklyComparisonChartProps {
    workouts: Workout[];
    currentDate: Date;
    isDarkMode?: boolean;
}

export const WeeklyComparisonChart: React.FC<WeeklyComparisonChartProps> = ({ workouts, currentDate, isDarkMode = true }) => {
    const chartData = useMemo(() => {
        const { start: currentWeekStart, end: currentWeekEnd } = getWeekRange(currentDate);
        
        const prevWeekDate = new Date(currentDate);
        prevWeekDate.setDate(currentDate.getDate() - 7);
        const { start: prevWeekStart, end: prevWeekEnd } = getWeekRange(prevWeekDate);

        const currentWeekWorkouts = workouts.filter(w => {
            const d = new Date(w.date + 'T00:00:00');
            return d >= currentWeekStart && d <= currentWeekEnd;
        });

        const prevWeekWorkouts = workouts.filter(w => {
            const d = new Date(w.date + 'T00:00:00');
            return d >= prevWeekStart && d <= prevWeekEnd;
        });
        
        const currentWeekCounts = WORKOUT_TYPES.reduce((acc, type) => ({...acc, [type]: 0}), {} as Record<WorkoutType, number>);
        currentWeekWorkouts.forEach(w => { 
            currentWeekCounts[w.type] += w.duration === WorkoutDuration.Completa ? 1 : 0.5;
        });

        const prevWeekCounts = WORKOUT_TYPES.reduce((acc, type) => ({...acc, [type]: 0}), {} as Record<WorkoutType, number>);
        prevWeekWorkouts.forEach(w => { 
            prevWeekCounts[w.type] += w.duration === WorkoutDuration.Completa ? 1 : 0.5;
        });

        return WORKOUT_TYPES.map(type => ({
            name: type,
            'Semana Actual': currentWeekCounts[type],
            'Semana Anterior': prevWeekCounts[type],
        }));

    }, [workouts, currentDate]);

    const gridColor = isDarkMode ? '#475569' : '#e5e7eb';
    const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
    const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
    const tooltipBorder = isDarkMode ? '#334155' : '#e5e7eb';
    const tooltipText = isDarkMode ? '#e2e8f0' : '#1e293b';
    const tooltipCursor = isDarkMode ? 'rgba(100, 116, 139, 0.1)' : 'rgba(59, 130, 246, 0.1)';
    const currentWeekColor = isDarkMode ? '#3b82f6' : '#0ea5e9';
    const prevWeekColor = isDarkMode ? '#64748b' : '#cbd5e1';

    return (
        <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
                    <YAxis stroke={axisColor} allowDecimals={true} width={30} />
                    <Tooltip
                        contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                        cursor={{ fill: tooltipCursor }}
                    />
                    <Legend wrapperStyle={{ color: axisColor }} />
                    <Bar dataKey="Semana Anterior" fill={prevWeekColor} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Semana Actual" fill={currentWeekColor} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};