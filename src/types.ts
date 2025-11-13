export enum WorkoutType {
  Pierna = 'Pierna',
  Pecho = 'Pecho',
  Espalda = 'Espalda',
  Cardio = 'Cardio',
}

export enum WorkoutDuration {
  Media = 'Media',
  Completa = 'Completa',
}

export interface Workout {
  id: number;
  date: string; // YYYY-MM-DD
  type: WorkoutType;
  duration: WorkoutDuration;
}

export type NewWorkout = Omit<Workout, 'id'>;

export interface BodyMetric {
  id: number;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  muscleMass: number; // kg
  bodyFatPercentage?: number; // % (calculated)
}

export type NewBodyMetric = Omit<BodyMetric, 'id' | 'bodyFatPercentage'>;