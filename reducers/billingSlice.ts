import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Billing } from "../types/Billing";



const initialState : Billing | null = null;


export const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        setBilling: (state: any, action: PayloadAction<Partial<Billing|null>>) => {
            return action.payload as any
        }
    }
});


export const { setBilling } = billingSlice.actions;

export default billingSlice.reducer