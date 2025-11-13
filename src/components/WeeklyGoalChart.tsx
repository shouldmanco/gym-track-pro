import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Workout, WorkoutType, WorkoutDuration } from '../types';
import { getWeekRange } from '../utils/date';

interface WeeklyGoalChartProps {
  workouts: Workout[];
  currentDate: Date;
  isDarkMode?: boolean;
}

const GOALS: Partial<Record<WorkoutType, number>> = {
  [WorkoutType.Cardio]: 1,
  [WorkoutType.Pecho]: 2,
  [WorkoutType.Espalda]: 2,
};
const GOAL_TYPES = Object.keys(GOALS) as WorkoutType[];
const TOTAL_GOAL = Object.values(GOALS).reduce((sum, val) => sum + val, 0);

export const WeeklyGoalChart: React.FC<WeeklyGoalChartProps> = ({ workouts, currentDate, isDarkMode = true }) => {
  const completedColor = isDarkMode ? '#22c55e' : '#0ea5e9';
  const remainingColor = isDarkMode ? '#475569' : '#e5e7eb';
  const textColor = isDarkMode ? '#f1f5f9' : '#1e293b';
  const COLORS = [completedColor, remainingColor];
  const chartData = useMemo(() => {
    const { start, end } = getWeekRange(currentDate);

    // 1. Filtrar entrenamientos para incluir solo los de la semana actual.
    const workoutsThisWeek = workouts.filter(w => {
      const workoutDate = new Date(w.date + 'T00:00:00');
      return workoutDate >= start && workoutDate <= end;
    });

    // 2. Calcular el progreso total basado en los entrenamientos de esta semana.
    let progress = 0;
    workoutsThisWeek.forEach(workout => {
        // Solo contamos el progreso para los tipos de entrenamiento que forman parte del objetivo.
        if (GOAL_TYPES.includes(workout.type)) {
            // Un entrenamiento de duración 'Media' cuenta como 0.5 para el objetivo.
            if (workout.duration === WorkoutDuration.Media) {
                progress += 0.5;
            // Un entrenamiento de duración 'Completa' cuenta como 1 para el objetivo.
            } else if (workout.duration === WorkoutDuration.Completa) {
                progress += 1;
            }
        }
    });

    // 3. Calcular el trabajo restante para alcanzar el objetivo total.
    const remaining = Math.max(0, TOTAL_GOAL - progress);
    
    // 4. Devolver los datos estructurados para el PieChart.
    return [
      { name: 'Completado', value: progress },
      { name: 'Restante', value: remaining },
    ];
  }, [workouts, currentDate]);

  const progressPercent = TOTAL_GOAL > 0 ? Math.round((chartData[0].value / TOTAL_GOAL) * 100) : 0;

  return (
    <div style={{ height: '300px', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
                      border: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`, 
                      color: isDarkMode ? '#e2e8f0' : '#1e293b' 
                    }}
                    formatter={(value: number, name: string) => [`${value} entrenamientos`, name]}
                />
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={true}
                    cornerRadius={5}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend wrapperStyle={{ color: textColor, paddingTop: '10px' }}/>
            </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`text-3xl font-bold ${textColor}`}>{`${progressPercent}%`}</span>
        </div>
    </div>
  );
};