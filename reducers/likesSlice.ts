import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";



const initialState : string[] = [];


export const likeSlice = createSlice({
    name: 'likes',
    initialState,
    reducers: {
        setLike: (state: any, action: PayloadAction<string[]>) => {
            return action.payload as any
        },
        removeLike: (state, action: PayloadAction<number>)=>{
           state.splice(action.payload, 1);
           return state;
        },
        addLike: (state, action: PayloadAction<string>) => {
            state.push(action.payload);
            return state;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => initialState); // THIS LINE
    },
});


export const { setLike, removeLike, addLike } = likeSlice.actions;


export default likeSlice.reducer