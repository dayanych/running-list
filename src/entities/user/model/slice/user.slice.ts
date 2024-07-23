import { createSlice } from '@reduxjs/toolkit';

import { User } from '@/entities/user/model/types/user.type';

type UserState = {
  user: User | null;
};

const initialState: UserState = { user: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    unsetUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, unsetUser } = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user;

export const userSliceReducer = userSlice.reducer;
