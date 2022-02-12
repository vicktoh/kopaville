import { configureStore } from "@reduxjs/toolkit";
import { User } from "../types/User";
import auth from "./authSlice";



export const store = configureStore({
    reducer: {
        auth
    }
})

export type RootState = ReturnType<typeof store.getState>
export type StoreType = {
    auth: User | null
}
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch