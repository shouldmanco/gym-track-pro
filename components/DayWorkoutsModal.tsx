import React from 'react';
import { Workout } from '../types';
import { WORKOUT_TYPE_COLORS } from '../constants';

interface DayWorkoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workouts: Workout[];
  date: string;
  onAdd: (date: string) => void;
  onEdit: (workout: Workout) => void;
  onDelete: (id: number) => void;
}

export const DayWorkoutsModal: React.FC<DayWorkoutsModalProps> = ({
  isOpen,
  onClose,
  workouts,
  date,
  onAdd,
  onEdit,
  onDelete,
}) => {
  if (!isOpen) return null;

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-slate-800 rounded-lg p-8 shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold mb-4 text-white">Entrenamientos del {formattedDate}</h2>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-6">
          {workouts.length > 0 ? workouts.map(workout => (
            <div key={workout.id} className="flex justify-between items-center bg-slate-700 p-3 rounded-md">
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-3 ${WORKOUT_TYPE_COLORS[workout.type]}`}></span>
                <div>
                  <p className="font-semibold">{workout.type}</p>
                  <p className="text-sm text-gray-400">{workout.duration}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(workout)}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(workout.id)}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )) : <p className="text-gray-400">No hay entrenamientos para este día.</p>}
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => onAdd(date)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Añadir Entrenamiento
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
