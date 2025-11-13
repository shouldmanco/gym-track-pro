import { Workout } from '../types';
import * as db from '../services/db';

export const exportWorkoutsToJSON = (workouts: Workout[]): void => {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    workouts,
  };
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gym-track-pro-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const deleteAllWorkouts = async (): Promise<void> => {
  const confirmed = window.confirm(
    '¿Estás seguro de que deseas eliminar TODOS los entrenamientos? Esta acción no se puede deshacer.'
  );
  if (!confirmed) return;

  const allWorkouts = await db.getAllWorkouts();
  for (const workout of allWorkouts) {
    await db.deleteWorkout(workout.id);
  }
};
