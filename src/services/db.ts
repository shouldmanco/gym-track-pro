import { Workout, NewWorkout } from '../types';

const DB_NAME = 'GymTrackDB';
const DB_VERSION = 1;
const STORE_NAME = 'workouts';

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
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = dbInstance.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

export const addWorkout = async (workout: NewWorkout): Promise<Workout> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(workout);

    transaction.oncomplete = () => {
      resolve({ ...workout, id: request.result as number });
    };

    transaction.onerror = () => {
      console.error('Transaction error adding workout:', transaction.error);
      reject(transaction.error);
    };
  });
};

export const getAllWorkouts = async (): Promise<Workout[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
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
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.put(workout);

        transaction.oncomplete = () => {
            resolve(workout);
        };

        transaction.onerror = () => {
            console.error('Transaction error updating workout:', transaction.error);
            reject(transaction.error);
        };
    });
};


export const deleteWorkout = async (id: number): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      console.error('Transaction error deleting workout:', transaction.error);
      reject(transaction.error);
    };
  });
};