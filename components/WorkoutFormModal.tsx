
import React, { useState, useEffect } from 'react';
import { Workout, NewWorkout, WorkoutType, WorkoutDuration } from '../types';
import { WORKOUT_TYPES, WORKOUT_DURATIONS } from '../constants';

interface WorkoutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: NewWorkout | Workout) => void;
  onDelete?: (id: number) => void;
  workoutToEdit: Workout | null;
  initialDate: string;
}

export const WorkoutFormModal: React.FC<WorkoutFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  workoutToEdit,
  initialDate,
}) => {
  const [date, setDate] = useState(initialDate);
  const [type, setType] = useState<WorkoutType>(WorkoutType.Pierna);
  const [duration, setDuration] = useState<WorkoutDuration>(WorkoutDuration.Media);

  useEffect(() => {
    if (workoutToEdit) {
      setDate(workoutToEdit.date);
      setType(workoutToEdit.type);
      setDuration(workoutToEdit.duration);
    } else {
      setDate(initialDate);
      setType(WorkoutType.Pierna);
      setDuration(WorkoutDuration.Media);
    }
  }, [workoutToEdit, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workoutData = { date, type, duration };
    if (workoutToEdit) {
      onSave({ ...workoutData, id: workoutToEdit.id });
    } else {
      onSave(workoutData);
    }
  };

  const handleDelete = () => {
    if (workoutToEdit && onDelete) {
      onDelete(workoutToEdit.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-slate-800 rounded-lg p-8 shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {workoutToEdit ? 'Editar Entrenamiento' : 'Añadir Entrenamiento'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Fecha</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Entrenamiento</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as WorkoutType)}
              className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {WORKOUT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">Duración</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value as WorkoutDuration)}
              className="w-full bg-slate-700 text-white rounded-md border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {WORKOUT_DURATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="ml-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
            {workoutToEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Eliminar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
    