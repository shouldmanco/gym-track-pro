import { Workout, NewWorkout, BodyMetric, NewBodyMetric } from '../types';

const DB_NAME = 'GymTrackDB';
const DB_VERSION = 2;
const WORKOUTS_STORE = 'workouts';
const BODY_METRICS_STORE = 'bodyMetrics';

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', request.error);
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      
      if (!dbInstance.objectStoreNames.contains(WORKOUTS_STORE)) {
        const objectStore = dbInstance.createObjectStore(WORKOUTS_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('date', 'date', { unique: false });
      }

      if (!dbInstance.objectStoreNames.contains(BODY_METRICS_STORE)) {
        const metricsStore = dbInstance.createObjectStore(BODY_METRICS_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        metricsStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

export const addWorkout = async (workout: NewWorkout): Promise<Workout> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(WORKOUTS_STORE, 'readwrite');
    const store = transaction.objectStore(WORKOUTS_STORE);
    const request = store.add(workout);

    request.onsuccess = () => {
      resolve({ ...workout, id: request.result as number });
    };

    request.onerror = () => {
      console.error('Request error adding workout:', request.error);
      reject(request.error);
    };
  });
};

export const getAllWorkouts = async (): Promise<Workout[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(WORKOUTS_STORE, 'readonly');
    const store = transaction.objectStore(WORKOUTS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error getting all workouts:', request.error);
      reject(request.error);
    };
  });
};

export const updateWorkout = async (workout: Workout): Promise<Workout> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(WORKOUTS_STORE, 'readwrite');
        const store = transaction.objectStore(WORKOUTS_STORE);
        const request = store.put(workout);

        request.onsuccess = () => {
            resolve(workout);
        };

        request.onerror = () => {
            console.error('Request error updating workout:', request.error);
            reject(request.error);
        };
    });
};

export const deleteWorkout = async (id: number): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(WORKOUTS_STORE, 'readwrite');
    const store = transaction.objectStore(WORKOUTS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error('Request error deleting workout:', request.error);
      reject(request.error);
    };
  });
};

// Body Metrics operations
export const addBodyMetric = async (metric: NewBodyMetric): Promise<BodyMetric> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BODY_METRICS_STORE, 'readwrite');
    const store = transaction.objectStore(BODY_METRICS_STORE);
    const request = store.add(metric);

    request.onsuccess = () => {
      resolve({ ...metric, id: request.result as number });
    };

    request.onerror = () => {
      console.error('Request error adding body metric:', request.error);
      reject(request.error);
    };
  });
};

export const getAllBodyMetrics = async (): Promise<BodyMetric[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BODY_METRICS_STORE, 'readonly');
    const store = transaction.objectStore(BODY_METRICS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error getting all body metrics:', request.error);
      reject(request.error);
    };
  });
};

export const updateBodyMetric = async (metric: BodyMetric): Promise<BodyMetric> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BODY_METRICS_STORE, 'readwrite');
    const store = transaction.objectStore(BODY_METRICS_STORE);
    const request = store.put(metric);

    request.onsuccess = () => {
      resolve(metric);
    };

    request.onerror = () => {
      console.error('Request error updating body metric:', request.error);
      reject(request.error);
    };
  });
};

export const deleteBodyMetric = async (id: number): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BODY_METRICS_STORE, 'readwrite');
    const store = transaction.objectStore(BODY_METRICS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error('Request error deleting body metric:', request.error);
      reject(request.error);
    };
  });
};