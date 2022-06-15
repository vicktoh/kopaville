import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

import { User } from "../types/User";


const initialState : User | null = null;


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state: any, action: PayloadAction<Partial<User|null>>) => {
            return action.payload as any
        } 
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => initialState); // THIS LINE
      }
});


export const { setAuth } = authSlice.actions;

export default authSlice.reducer