import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../types/Profile";


const initialState : Profile | null = null;


export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state: any, action: PayloadAction<Partial<Profile>>) => {
            return { ...(state || {}), ...action.payload }
        }
    }
});


export const { setProfile } =  profileSlice.actions;

export default profileSlice.reducer