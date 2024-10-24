import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk para obtener los reportes
export const fetchReports = createAsyncThunk('reports/fetchReports', async () => {
  const response = await axios.get('http://localhost:3000/api/reports'); // Actualiza la URL si es necesario
  return response.data;
});

// Thunk para crear un reporte
export const createReport = createAsyncThunk('reports/createReport', async (report) => {
  try {
    const response = await axios.post('http://localhost:3000/api/reports', report, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

	if (response.status !== 201) {
		throw new Error('Error al crear el reporte');
	  }
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error.response?.data || 'Error desconocido al crear el reporte';
  }
});

// Creación del slice
const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    items: [],
    status: 'idle',
    error: null, // Manejo de errores
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchReports
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // createReport
      .addCase(createReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default reportSlice.reducer;

