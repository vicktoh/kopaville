import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { Billing } from "../types/Billing";



const initialState : Billing | null = null;


export const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        setBilling: (state: any, action: PayloadAction<Partial<Billing|null>>) => {
            return action.payload as any
        }
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => initialState); // THIS LINE
      }
});


export const { setBilling } = billingSlice.actions;

export default billingSlice.reducer