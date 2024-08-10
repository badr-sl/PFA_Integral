import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';

interface User {
  id?: number;
  name: string;
  email?: string;
  password?: string;
  PhoneNumber: string;
  role?: string;
}

interface AssignTaskPayload {
  task_id: number;
  user_id: number;
}

interface ValidationErrors {
  [key: string]: string[];
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  validationErrors: ValidationErrors | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  validationErrors: null,
};

export const fetchAllUsers = createAsyncThunk<User[], void, {}>(
  'users/fetchAll',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await axios.get('http://localhost:8000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

export const createUser = createAsyncThunk<
  User,
  User,
  { rejectValue: ValidationErrors }
>('users/create', async (newUser, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const token = state.auth.token;

  try {
    const response = await axios.post('http://localhost:8000/api/user', newUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return rejectWithValue(err.response.data.errors);
    }
    throw err;
  }
});

export const updateUser = createAsyncThunk<
  User,
  User,
  { rejectValue: ValidationErrors }
>('users/update', async (updatedUser, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const token = state.auth.token;

  try {
    const response = await axios.put(`http://localhost:8000/api/user/${updatedUser.id}`, updatedUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return rejectWithValue(err.response.data.errors);
    }
    throw err;
  }
});

export const assignTaskToUser = createAsyncThunk<void, AssignTaskPayload, { rejectValue: string }>(
  'users/assignTask',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      await axios.post('http://localhost:8000/api/task-assignments', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extraction du message d'erreur spécifique
        const errorMessage = error.response.data.message || 'Une erreur s\'est produite lors de l\'assignation de la tâche';
        console.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else {
        // Erreur non-Axios ou sans réponse
        return rejectWithValue('Une erreur inattendue s\'est produite');
      }
    }
  }
);

export const deleteTaskAssignment = createAsyncThunk<void, number, {}>(
  'users/deleteTaskAssignment',
  async (id, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    await axios.delete(`http://localhost:8000/api/task-assignments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
);

export const logout = createAsyncThunk<null, void, {}>(
  'users/logout',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    await axios.post('http://localhost:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return null;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.validationErrors = null;
      })
      .addCase(createUser.rejected, (state, action: PayloadAction<any>) => {
        state.validationErrors = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.validationErrors = null;
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.validationErrors = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.users = [];
        state.validationErrors = null;
      })
      .addCase(logout.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload || 'Failed to logout';
      });
  },
});

export default usersSlice.reducer;