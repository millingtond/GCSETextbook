import { createSlice } from '@reduxjs/toolkit';
import { CONSTANTS } from '../utils/constants';

const getInitialState = () => {
  const defaultState = {};
  
  try {
    // Check if localStorage is available
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedProgress = localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.PROGRESS_STATE);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        // Validate the loaded state
        if (typeof parsedProgress === 'object' && parsedProgress !== null) {
          return parsedProgress;
        }
      }
    }
  } catch (error) {
    console.error('Could not load progress from localStorage:', error);
    // Clear corrupted data
    try {
      localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_KEYS.PROGRESS_STATE);
    } catch {
      // Ignore if we can't remove it
    }
  }
  
  return defaultState;
};

const progressSlice = createSlice({
  name: 'progress',
  initialState: getInitialState(),
  reducers: {
    toggleComplete: (state, action) => {
      const slug = action.payload;
      if (!state[slug]) {
        state[slug] = { 
          completed: false, 
          ragStatus: 'none',
          lastUpdated: new Date().toISOString()
        };
      }
      state[slug].completed = !state[slug].completed;
      state[slug].lastUpdated = new Date().toISOString();
    },
    setRagStatus: (state, action) => {
      const { slug, status } = action.payload;
      if (!state[slug]) {
        state[slug] = { 
          completed: false, 
          ragStatus: 'none',
          lastUpdated: new Date().toISOString()
        };
      }
      // Allow toggling off a RAG status by clicking it again
      state[slug].ragStatus = state[slug].ragStatus === status ? 'none' : status;
      state[slug].lastUpdated = new Date().toISOString();
    },
    updateRevisionDate: (state, action) => {
      const { slug, nextRevisionDate } = action.payload;
      if (!state[slug]) {
        state[slug] = { 
          completed: false, 
          ragStatus: 'none',
          lastUpdated: new Date().toISOString()
        };
      }
      state[slug].nextRevision = nextRevisionDate;
      state[slug].lastUpdated = new Date().toISOString();
    },
    // New action to clear all progress
    clearAllProgress: (state) => {
      return {};
    },
    // New action to import progress
    importProgress: (state, action) => {
      const importedProgress = action.payload;
      if (typeof importedProgress === 'object' && importedProgress !== null) {
        return importedProgress;
      }
      return state;
    }
  },
});

export const { 
  toggleComplete, 
  setRagStatus, 
  updateRevisionDate, 
  clearAllProgress,
  importProgress 
} = progressSlice.actions;

export default progressSlice.reducer;