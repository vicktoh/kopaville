import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { System } from "../types/System";


const initialState : System | null = null;


export const systemSlice = createSlice({
    name: 'systemInfo',
    initialState,
    reducers: {
        setSystemInfo: (state: any, action: PayloadAction<Partial<System> | null>) => {
            return action.payload as any
        }
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => initialState); // THIS LINE
    },
});


export const { setSystemInfo } = systemSlice.actions;

export default systemSlice.reducer