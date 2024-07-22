import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationState {
  notifications: any[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Define your reducers here
  },
});

export default notificationSlice.reducer;
