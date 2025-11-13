import { WorkoutType, WorkoutDuration } from './types';

export const WORKOUT_TYPES: WorkoutType[] = [
  WorkoutType.Pierna,
  WorkoutType.Pecho,
  WorkoutType.Espalda,
  WorkoutType.Cardio,
];

export const WORKOUT_DURATIONS: WorkoutDuration[] = [
  WorkoutDuration.Media,
  WorkoutDuration.Completa,
];

export const WORKOUT_TYPE_COLORS: Record<WorkoutType, string> = {
  [WorkoutType.Pierna]: 'bg-blue-500',
  [WorkoutType.Pecho]: 'bg-red-500',
  [WorkoutType.Espalda]: 'bg-green-500',
  [WorkoutType.Cardio]: 'bg-yellow-500',
};

export const WORKOUT_TYPE_COLORS_CHART: Record<WorkoutType, string> = {
  [WorkoutType.Pierna]: '#3b82f6',
  [WorkoutType.Pecho]: '#ef4444',
  [WorkoutType.Espalda]: '#22c55e',
  [WorkoutType.Cardio]: '#eab308',
};
