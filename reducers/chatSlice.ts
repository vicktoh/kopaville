import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation } from "../types/Conversation";

import { User } from "../types/User";


const initialState : Conversation []| null = null;


export const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats: (state: any, action: PayloadAction<Partial<User|null>>) => {
            return action.payload as any
        }
    }
});


export const { setChats } = chatSlice.actions;

export default chatSlice.reducer