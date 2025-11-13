import React, { useState, useEffect, useMemo } from 'react';
import { Workout, NewWorkout } from '../types';
import { WORKOUT_TYPE_COLORS } from '../constants';
import * as db from '../services/db';
import { WorkoutFormModal } from './WorkoutFormModal';
import { DayWorkoutsModal } from './DayWorkoutsModal';

const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

interface CalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  workouts: Workout[];
  onDataChange: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  setCurrentDate,
  workouts,
  onDataChange
}) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDayWorkouts, setSelectedDayWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    if (isDayModalOpen) {
      const updatedWorkoutsForDay = workouts.filter(w => w.date === selectedDate);
      setSelectedDayWorkouts(updatedWorkoutsForDay);
    }
  }, [workouts, isDayModalOpen, selectedDate]);

  
  const handleSaveWorkout = async (workoutData: NewWorkout | Workout) => {
    if ('id' in workoutData) {
      await db.updateWorkout(workoutData);
    } else {
      await db.addWorkout(workoutData);
    }
    onDataChange();
    setIsFormModalOpen(false);
    setWorkoutToEdit(null);
  };

  const handleDeleteWorkout = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      await db.deleteWorkout(id);
      onDataChange();
      setIsFormModalOpen(false);
      setWorkoutToEdit(null);
    }
  };

  const openAddModal = (date: string) => {
    setSelectedDate(date);
    setWorkoutToEdit(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (workout: Workout) => {
    setWorkoutToEdit(workout);
    setSelectedDate(workout.date);
    setIsFormModalOpen(true);
  };

  const handleDayClick = (dateStr: string, workoutsForDay: Workout[]) => {
    setSelectedDate(dateStr);
    if (workoutsForDay.length > 0) {
      setSelectedDayWorkouts(workoutsForDay);
      setIsDayModalOpen(true);
    } else {
      openAddModal(dateStr);
    }
  };

  const handleAddFromDayModal = (date: string) => {
    setIsDayModalOpen(false);
    openAddModal(date);
  };

  const handleEditFromDayModal = (workout: Workout) => {
    setIsDayModalOpen(false);
    openEditModal(workout);
  };

  const handleDeleteFromDayModal = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      // Optimistically update the local state for the modal for instant feedback
      setSelectedDayWorkouts(currentWorkouts => currentWorkouts.filter(w => w.id !== id));
      
      try {
        await db.deleteWorkout(id);
        // Then, trigger the global state update to ensure data consistency
        onDataChange();
      } catch (error) {
        console.error("Failed to delete workout:", error);
        // If the delete fails, revert the optimistic update by refetching.
        onDataChange(); 
        alert("Error al eliminar el entrenamiento.");
      }
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(1); // Avoid date overflow issues
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const calendarGridDates = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    const startDate = new Date(firstDayOfMonth);
    // Adjust to start the week on Monday
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + diff);

    const dates = [];
    for (let i = 0; i < 42; i++) { // Always generate 42 days (6 weeks) for a consistent grid
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
    }
    return dates;
  }, [currentDate]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors duration-200" aria-label="Previous month">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold capitalize text-center">
          {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors duration-200" aria-label="Next month">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-400 mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {calendarGridDates.map((date, index) => {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const workoutsForDay = workouts.filter(w => w.date === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            const dayClasses = `p-2 border rounded-md flex flex-col cursor-pointer transition-colors duration-200 min-h-[100px] ${
                isCurrentMonth ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-800 text-slate-500'
            } ${isToday ? 'bg-slate-700/50' : ''}`;
            
            const dateNumberClasses = `font-bold ${
                isCurrentMonth ? (isToday ? 'text-blue-400' : 'text-white') : ''
            }`;

            return (
                <div 
                    key={`${dateStr}-${index}`}
                    className={dayClasses}
                    onClick={() => handleDayClick(dateStr, workoutsForDay)}
                >
                    <span className={dateNumberClasses}>{date.getDate()}</span>
                    <div className="mt-1 space-y-1 flex-grow overflow-y-auto" style={{ maxHeight: '80px' }}>
                        {workoutsForDay.map(w => (
                            <div 
                                key={w.id} 
                                className={`text-xs text-white p-1 rounded-md ${WORKOUT_TYPE_COLORS[w.type]} shadow-md flex items-center justify-between truncate`}
                            >
                                <span>{w.type}</span>
                                {w.duration === 'Completa' && <span title="Duración Completa">💪</span>}
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
      <WorkoutFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveWorkout}
        onDelete={handleDeleteWorkout}
        workoutToEdit={workoutToEdit}
        initialDate={selectedDate}
      />
      <DayWorkoutsModal 
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        workouts={selectedDayWorkouts}
        date={selectedDate}
        onAdd={handleAddFromDayModal}
        onEdit={handleEditFromDayModal}
        onDelete={handleDeleteFromDayModal}
      />
    </div>
  );
};