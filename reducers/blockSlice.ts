import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Block } from "../types/Profile";



const initialState : Block | null = null;


export const blockSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setBlock: (state: any, action: PayloadAction<Partial<Block|null>>) => {
            return action.payload as any
        }
    }
});

export const { setBlock } = blockSlice.actions;

export default blockSlice.reducer