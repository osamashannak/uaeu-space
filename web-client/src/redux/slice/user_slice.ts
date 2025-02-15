import {createSlice} from '@reduxjs/toolkit'

interface UserState {
    id: string,
    username: string,
    csrfToken: string,
    status: "guest" | "authenticated" | null
}

const initialState: UserState = {
    id: "",
    username: "",
    csrfToken: "",
    status: "guest"
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.csrfToken = action.payload.csrfToken
            state.status = action.payload.status
        },
        clearUser: (state) => {
            state.id = ""
            state.username = ""
            state.csrfToken = ""
            state.status = null
        }
    }
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer