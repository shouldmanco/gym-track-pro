import React from 'react';
import { Workout } from '../types';
import { WeeklyGoalChart } from './WeeklyGoalChart';
import { WeeklyComparisonChart } from './WeeklyComparisonChart';

interface ChartsContainerProps {
  workouts: Workout[];
  currentDate: Date;
}

export const ChartsContainer: React.FC<ChartsContainerProps> = ({ workouts, currentDate }) => {
  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-slate-800 p-4 rounded-lg shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-200">Objetivo Semanal</h3>
        <WeeklyGoalChart workouts={workouts} currentDate={currentDate} />
      </div>
      <div className="bg-slate-800 p-4 rounded-lg shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-200">Comparativa Semanal</h3>
        <WeeklyComparisonChart workouts={workouts} currentDate={currentDate} />
      </div>
    </div>
  );
};
