import React, { useState, useEffect, useCallback } from 'react';
import { CalendarView } from './components/CalendarView';
import { ChartsContainer } from './components/ChartsContainer';
import { BodyMetricsTracker } from './components/BodyMetricsTracker';
import { Workout } from './types';
import * as db from './services/db';
import { exportWorkoutsToJSON, deleteAllWorkouts } from './utils/export';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gym-track-pro-theme');
    return saved ? saved === 'dark' : true;
  });

  const fetchWorkouts = useCallback(async () => {
    const allWorkouts = await db.getAllWorkouts();
    setWorkouts(allWorkouts);
  }, []);

  useEffect(() => {
    localStorage.setItem('gym-track-pro-theme', isDarkMode ? 'dark' : 'light');
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    db.initDB().then(() => {
      fetchWorkouts();
    });
  }, [fetchWorkouts]);

  // Theme configuration
  const theme = {
    dark: {
      bg: 'bg-slate-950',
      surface: 'bg-slate-900',
      border: 'border-slate-700',
      text: 'text-slate-50',
      textSecondary: 'text-slate-300',
      header: 'bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700',
      shadow: 'shadow-xl',
    },
    light: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      surface: 'bg-white',
      border: 'border-slate-200',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
      header: 'bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-700',
      shadow: 'shadow-lg',
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
        <header className={`${currentTheme.header} ${currentTheme.shadow} p-4 sticky top-0 z-20 transition-all duration-300`}>
          <div className="container mx-auto flex justify-between items-center">
            <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-white'} tracking-wider drop-shadow-md`}>
              Gym<span className={isDarkMode ? 'text-cyan-400' : 'text-white'}>Track</span> Pro
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => exportWorkoutsToJSON(workouts)}
                className={`${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/50' : 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-300/40'} text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105`}
                title="Descargar entrenamientos como JSON"
              >
                ⬇ Exportar
              </button>
              <button
                onClick={async () => {
                  await deleteAllWorkouts();
                  await fetchWorkouts();
                }}
                className={`${isDarkMode ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/50' : 'bg-red-500 hover:bg-red-600 shadow-md shadow-red-300/40'} text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105`}
                title="Eliminar todos los entrenamientos"
              >
                🗑️ Borrar Todo
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`${isDarkMode ? 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-900/50' : 'bg-slate-700 hover:bg-slate-800 shadow-md shadow-slate-400/40'} text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105`}
                title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>
        <main className="container mx-auto pb-8 px-4 space-y-8">
          <CalendarView 
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            workouts={workouts}
            onDataChange={fetchWorkouts}
            isDarkMode={isDarkMode}
          />
          <ChartsContainer 
            currentDate={currentDate}
            workouts={workouts}
            isDarkMode={isDarkMode}
          />
          <BodyMetricsTracker isDarkMode={isDarkMode} />
        </main>
      </div>
    </div>
  );
};

export default App;
