import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { Block } from "../types/Profile";



const initialState : Block | null = null;


export const blockSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setBlock: (state: any, action: PayloadAction<Partial<Block|null>>) => {
            return action.payload as any
        }
    },

    extraReducers: (builder) => {
        builder.addCase(PURGE, () => initialState); // THIS LINE
      }
});

export const { setBlock } = blockSlice.actions;

export default blockSlice.reducer