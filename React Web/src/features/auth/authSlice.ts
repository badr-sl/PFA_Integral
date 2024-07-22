import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { register, login } from './authAPI';

export interface AuthState {
  user: any;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface AsyncThunkConfig {
  rejectValue: string;
}

export const loginUser = createAsyncThunk<any, LoginCredentials, AsyncThunkConfig>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      console.log('Login response:', response);
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);
export const logoutUser = createAsyncThunk<any, LoginCredentials, AsyncThunkConfig>(
  'auth/logoutUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      console.log('Logout response:', response);
      return response;
    } catch (error: any) {
      console.error('Logout error:', error);
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const registerUser = createAsyncThunk<any, RegisterData, AsyncThunkConfig>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      console.log('Registration response:', response);
      return response;
    } catch (error: any) {
      console.error('Registration error:', error);
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null; 
        console.log('User logged in:', state.user);
        console.log('Token:', state.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null; 
        console.log('User registered:', state.user);
        console.log('Token:', state.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
