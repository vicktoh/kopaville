import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../types/Post";    


const initialState : Post[] | null = null;


export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state: any, action: PayloadAction< (Post)[] | null>) => {
            return action.payload as any
        }
    }
});


export const { setPosts } =  postsSlice.actions;

export default postsSlice.reducer