import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "firebase/auth";
import { User } from "../types/User";


const initialState : User | null = null;


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state: any, action: PayloadAction<Partial<User|null> | UserInfo>) => {
            return action.payload as any
        }
    }
});


export const { setAuth } = authSlice.actions;

export default authSlice.reducer