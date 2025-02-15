import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slice/user_slice.ts";
import professorReducer from "./slice/professor_slice.ts";

const store = configureStore({
    reducer: {
        user: userReducer,
        professor: professorReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;