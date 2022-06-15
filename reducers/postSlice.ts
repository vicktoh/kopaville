import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { Post } from '../types/Post';

const initialState: Post[] | null | 'error' = null;

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (
            state: any,
            action: PayloadAction<Post[] | null | 'error'>
        ) => {
            return action.payload as any;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => initialState); // THIS LINE
    },
});

export const { setPosts } = postsSlice.actions;

export default postsSlice.reducer;
