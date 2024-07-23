import { configureStore } from '@reduxjs/toolkit';

import { userSliceReducer } from '@/entities/user/model/slice/user.slice';

const store = configureStore({ reducer: { user: userSliceReducer } });

export { store };
