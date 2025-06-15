import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  try {
    const savedProgress = localStorage.getItem('progressState');
    return savedProgress ? JSON.parse(savedProgress) : {};
  } catch (e) {
    console.error('Could not load progress from local storage', e);
    return {};
  }
};

const progressSlice = createSlice({
  name: 'progress',
  initialState: getInitialState(),
  reducers: {
    toggleComplete: (state, action) => {
      const slug = action.payload;
      if (!state[slug]) state[slug] = { completed: false, ragStatus: 'none' };
      state[slug].completed = !state[slug].completed;
    },
    setRagStatus: (state, action) => {
      const { slug, status } = action.payload;
      if (!state[slug]) state[slug] = { completed: false, ragStatus: 'none' };
      // Allow toggling off a RAG status by clicking it again
      state[slug].ragStatus = state[slug].ragStatus === status ? 'none' : status;
    },
    // Future reducer for spaced repetition
    updateRevisionDate: (state, action) => {
        const {slug, nextRevisionDate} = action.payload;
        if(state[slug]) {
            state[slug].nextRevision = nextRevisionDate;
        }
    }
  },
});

export const { toggleComplete, setRagStatus, updateRevisionDate } = progressSlice.actions;
export default progressSlice.reducer;
