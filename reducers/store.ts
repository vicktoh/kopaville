import { configureStore } from "@reduxjs/toolkit";
import { System } from "../types/System";
import { User } from "../types/User";
import auth from "./authSlice";
import systemInfo from './systemSlice';


export const store = configureStore({
    reducer: {
        auth,
        systemInfo
    }
})

export type RootState = ReturnType<typeof store.getState>
export type StoreType = {
    auth: User | null,
    systemInfo: System
}
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch