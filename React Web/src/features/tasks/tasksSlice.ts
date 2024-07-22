import { createSlice, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { RootState } from '../../app/store';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  progress: number | null;
}

interface NewTask {
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  progress: number | 0;
}

interface UpdateTask {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  progress: number | null;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchAllTasks: AsyncThunk<Task[], void, {}> = createAsyncThunk('tasks/fetchAll', async (_, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.token;

  const response: AxiosResponse<any, any> = await axios.get('http://localhost:8000/api/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('API response:', response.data);

  return response.data.data;
});

export const addTask: AsyncThunk<Task, NewTask, {}> = createAsyncThunk('tasks/addTask', async (task, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.token;

  const response: AxiosResponse<any, any> = await axios.post('http://localhost:8000/api/tasks', task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Add Task API response:', response.data);

  return response.data;
});

export const updateTask: AsyncThunk<Task, UpdateTask, {}> = createAsyncThunk('tasks/updateTask', async (task, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.token;

  const response: AxiosResponse<any, any> = await axios.put(`http://localhost:8000/api/tasks/${task.id}`, task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Update Task API response:', response.data);

  return response.data;
});

export const deleteTask: AsyncThunk<{ id: number }, number, {}> = createAsyncThunk('tasks/deleteTask', async (id, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.token;

  const response: AxiosResponse<any, any> = await axios.delete(`http://localhost:8000/api/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Delete Task API response:', response.data);

  return { id };
});

export const fetchUserTasks: AsyncThunk<Task[], number, {}> = createAsyncThunk('tasks/fetchUserTasks', async (userId, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.token;

  const response: AxiosResponse<any, any> = await axios.get(`http://localhost:8000/api/user/${userId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('User Tasks API response:', response.data);

  return Array.isArray(response.data.data) ? response.data.data : [];
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = Array.isArray(action.payload) ? action.payload : [];
        console.log('Tasks loaded:', state.tasks);
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
        console.error('Fetch tasks error:', action.error.message);
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        console.log('Task added:', action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        console.log('Task updated:', action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload.id);
        console.log('Task deleted:', action.payload.id);
      })
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = Array.isArray(action.payload) ? action.payload : [];
        console.log('User tasks loaded:', state.tasks);
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user tasks';
        console.error('Fetch user tasks error:', action.error.message);
      });
  },
});

export default tasksSlice.reducer;
