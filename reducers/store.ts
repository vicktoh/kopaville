import { configureStore } from "@reduxjs/toolkit";
import { System } from "../types/System";
import { User } from "../types/User";
import auth from "./authSlice";
import systemInfo from './systemSlice';
import posts from './postSlice';
import { ImagePost, TextPost } from "../types/Post";


export const store = configureStore({
    reducer: {
        auth,
        systemInfo,
        posts
    }
})

export type RootState = ReturnType<typeof store.getState>
export type StoreType = {
    auth: User | null,
    systemInfo: System,
    posts: TextPost | ImagePost | null;
}
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch