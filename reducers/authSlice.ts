import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/User";


const initialState : User | null = null;


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state) => {
            var state = state
            return state;
        }
    }
});


export const { setAuth } = authSlice.actions;

export default authSlice.reducer