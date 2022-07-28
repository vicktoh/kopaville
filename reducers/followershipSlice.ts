import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { Folowership } from "../types/Followership";

const initialState : Folowership | null =  null;


export const followershipSlice = createSlice({
    name: 'followerships',
    initialState,
    reducers: {
        setFollowership: (state: any, action: PayloadAction<Partial<Folowership>>) => {
            return {...(state || {}), ...action.payload}
        },
        addFollower: (state: any, action: PayloadAction<{userId: string, photoUrl: string, fullname: string; username: string }>) =>{
            return {...(state || {}), followers: [...(state?.followers || []), action.payload]}
        },
        addFollowing: (state: any, action: PayloadAction<{userId: string, photoUrl: string, fullname: string; username: string }>) =>{
            return {...(state || {}), following: [...(state?.following || []), action.payload]}
        }
        
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => initialState); // THIS LINE
    },
});


export const { setFollowership, addFollower, addFollowing } =  followershipSlice.actions;

export default followershipSlice.reducer