import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slice/user_slice.ts";
import professorReducer from "./slice/professor_slice.ts";

const store = configureStore({
    reducer: {
        user: userReducer,
        professor: professorReducer
    },
})

export default store;