import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategorySliceType } from "../types/Category";

const initialAuth: CategorySliceType | null = null;

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: initialAuth,
    reducers: {
        setCategories: (state: CategorySliceType | null, action: PayloadAction<CategorySliceType|null>) => {
             state = action.payload;
             return state as any  
        },
    },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;