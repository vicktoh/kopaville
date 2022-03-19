import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "../types/User";


const initialState : User | null = null;


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state: any, action: PayloadAction<Partial<User|null>>) => {
            return action.payload as any
        }
    }
});


export const { setAuth } = authSlice.actions;

export default authSlice.reducer