import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "firebase/auth";
import { System } from "../types/System";


const initialState : System | null = null;


export const systemSlice = createSlice({
    name: 'systemInfo',
    initialState,
    reducers: {
        setSystemInfo: (state: any, action: PayloadAction<Partial<System> | null>) => {
            return action.payload as any
        }
    }
});


export const { setSystemInfo } = systemSlice.actions;

export default systemSlice.reducer