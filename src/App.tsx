import React, { useState, useEffect, useCallback } from 'react';
import { CalendarView } from './components/CalendarView';
import { ChartsContainer } from './components/ChartsContainer';
import { Workout } from '../types';
import * as db from './services/db';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const fetchWorkouts = useCallback(async () => {
    const allWorkouts = await db.getAllWorkouts();
    setWorkouts(allWorkouts);
  }, []);

  useEffect(() => {
    db.initDB().then(() => {
      fetchWorkouts();
    });
  }, [fetchWorkouts]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      <header className="bg-slate-800 shadow-lg p-4 sticky top-0 z-20">
        <div className="container mx-auto flex justify-center items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
            Gym<span className="text-blue-400">Track</span> Pro
          </h1>
        </div>
      </header>
      <main className="container mx-auto pb-8">
        <CalendarView 
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          workouts={workouts}
          onDataChange={fetchWorkouts}
        />
        <ChartsContainer 
          currentDate={currentDate}
          workouts={workouts}
        />
      </main>
    </div>
  );
};

export default App;