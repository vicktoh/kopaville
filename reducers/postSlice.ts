import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TextPost, ImagePost } from "../types/Post";    


const initialState : TextPost| ImagePost | null = null;


export const postsSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setPosts: (state: any, action: PayloadAction< TextPost |ImagePost| null>) => {
            return action.payload as any
        }
    }
});


export const { setPosts } =  postsSlice.actions;

export default postsSlice.reducer