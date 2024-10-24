import { configureStore } from '@reduxjs/toolkit';
import reportReducer from './reportSlice.jsx';

export const store = configureStore({
  reducer: {
    reports: reportReducer,
  },
});
