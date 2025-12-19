import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Helper to get initial user ID from localStorage or env
const getInitialUserId = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('openmemory_user_id');
    if (stored) return stored;
  }
  return process.env.NEXT_PUBLIC_USER_ID || 'user';
};

interface ProfileState {
  userId: string;
  totalMemories: number;
  totalApps: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  apps: any[];
}

const initialState: ProfileState = {
  userId: getInitialUserId(),
  totalMemories: 0,
  totalApps: 0,
  status: 'idle',
  error: null,
  apps: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('openmemory_user_id', action.payload);
      }
    },
    setProfileLoading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setProfileError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    resetProfileState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.userId = getInitialUserId();
    },
    setTotalMemories: (state, action: PayloadAction<number>) => {
      state.totalMemories = action.payload;
    },
    setTotalApps: (state, action: PayloadAction<number>) => {
      state.totalApps = action.payload;
    },
    setApps: (state, action: PayloadAction<any[]>) => {
      state.apps = action.payload;
    }
  },
});

export const {
  setUserId,
  setProfileLoading,
  setProfileError,
  resetProfileState,
  setTotalMemories,
  setTotalApps,
  setApps
} = profileSlice.actions;

export default profileSlice.reducer;
