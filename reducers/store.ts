import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { System } from '../types/System';
import { User } from '../types/User';
import auth from './authSlice';
import systemInfo from './systemSlice';
import posts from './postSlice';
import followerships from './followershipSlice';
import profile from './profileSlice';
import likes from './likesSlice';
import chats from './chatSlice';
import cart from './cartSlice';
import billing from './billingSlice';
import categories from './categoriesSlice';
import { Post } from '../types/Post';
import { Folowership } from '../types/Followership';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { Profile } from '../types/Profile';
import { Conversation } from '../types/Conversation';
import { CategorySliceType } from '../types/Category';
import { CartItem } from '../types/Product';
import { Billing } from '../types/Billing';


const rootReducer = combineReducers({
    auth,
    systemInfo,
    posts,
    followerships,
    profile,
    likes, 
    chats,
    categories,
    cart,
    billing
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
    posts: Post[] | null;
    followerships: Folowership | null;
    profile: Profile | null,
    likes: string[],
    chats: Conversation [],
    categories: CategorySliceType,
    cart: CartItem[] | null,
    billing: Billing | null
};
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
