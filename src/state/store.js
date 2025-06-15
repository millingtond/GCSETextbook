import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './progressSlice';

// Middleware to save state to localStorage on every state change.
const localStorageMiddleware = store => next => action => {
  const result = next(action);
  try {
    const serializedState = JSON.stringify(store.getState().progress);
    localStorage.setItem('progressState', serializedState);
  } catch (e) {
    console.warn("Could not save progress to local storage", e);
  }
  return result;
};

export const store = configureStore({
  reducer: {
    progress: progressReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});
