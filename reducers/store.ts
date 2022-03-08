import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { System } from '../types/System';
import { User } from '../types/User';
import auth from './authSlice';
import systemInfo from './systemSlice';
import posts from './postSlice';
import followerships from './followershipSlice';
import profile from './profileSlice'
import { ImagePost, TextPost } from '../types/Post';
import { Folowership } from '../types/Followership';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { Profile } from '../types/Profile';


const rootReducer = combineReducers({
    auth,
    systemInfo,
    posts,
    followerships,
    profile
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorageLib,
    version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>(getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    }))
});

export const persistor  = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type StoreType = {
    auth: User | null;
    systemInfo: System;
    posts: (TextPost | ImagePost)[] | null;
    followerships: Folowership | null;
    profile: Profile | null
};
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
