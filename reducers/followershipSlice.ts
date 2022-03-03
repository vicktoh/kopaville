import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Folowership } from "../types/Followership";

const initialState : Folowership | null =  null;


export const followershipSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setFollowership: (state: any, action: PayloadAction<Partial<Folowership>>) => {
            return {...(state || {}), ...action.payload}
        }
    }
});


export const { setFollowership } =  followershipSlice.actions;

export default followershipSlice.reducer