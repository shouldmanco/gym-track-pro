import React from 'react';
import { Workout } from '../types';
import { WeeklyGoalChart } from './WeeklyGoalChart';
import { WeeklyComparisonChart } from './WeeklyComparisonChart';
import { MonthlyTrendChart } from './MonthlyTrendChart';

interface ChartsContainerProps {
  workouts: Workout[];
  currentDate: Date;
  isDarkMode?: boolean;
}

export const ChartsContainer: React.FC<ChartsContainerProps> = ({ workouts, currentDate, isDarkMode = true }) => {
  const bgColor = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-200' : 'text-slate-900';
  const borderColor = isDarkMode ? '' : 'border border-slate-200';

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${bgColor} ${borderColor} p-4 rounded-lg shadow-xl transition-colors duration-300`}>
          <h3 className={`text-xl font-bold mb-4 text-center ${textColor}`}>Objetivo Semanal</h3>
          <WeeklyGoalChart workouts={workouts} currentDate={currentDate} isDarkMode={isDarkMode} />
        </div>
        <div className={`${bgColor} ${borderColor} p-4 rounded-lg shadow-xl transition-colors duration-300`}>
          <h3 className={`text-xl font-bold mb-4 text-center ${textColor}`}>Comparativa Semanal</h3>
          <WeeklyComparisonChart workouts={workouts} currentDate={currentDate} isDarkMode={isDarkMode} />
        </div>
      </div>
      <div className={`${bgColor} ${borderColor} p-4 rounded-lg shadow-xl transition-colors duration-300`}>
        <h3 className={`text-xl font-bold mb-4 text-center ${textColor}`}>Tendencia de 3 Meses</h3>
        <MonthlyTrendChart workouts={workouts} currentDate={currentDate} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};