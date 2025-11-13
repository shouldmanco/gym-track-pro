import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Workout, WorkoutType, WorkoutDuration } from '../types';
import { WORKOUT_TYPES } from '../constants';
import { getWeekRange } from '../../utils/date';

interface WeeklyComparisonChartProps {
    workouts: Workout[];
    currentDate: Date;
}

export const WeeklyComparisonChart: React.FC<WeeklyComparisonChartProps> = ({ workouts, currentDate }) => {
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

    return (
        <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" allowDecimals={true} width={30} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
                        cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                    />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                    <Bar dataKey="Semana Anterior" fill="#64748b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Semana Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};