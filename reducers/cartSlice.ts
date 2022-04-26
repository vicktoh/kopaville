import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types/Product";

import { User } from "../types/User";


const initialState : CartItem[] | null = null;


export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state: any, action: PayloadAction<CartItem[]|null>) => {
            return action.payload as any
        },
        addToCart: (state: any, action: PayloadAction<CartItem>) => {
           if(!state) return [action.payload];
           const newItem = action.payload
           const index = state.findIndex((item: CartItem )=> item.productId === newItem.productId)
           if(index > -1){
             
               state[index].quantity++;
              return state;
               
           }
           else{
              state.push(newItem);
               return state
           }
        }
    }
});


export const { setCart, addToCart } = cartSlice.actions;

export default cartSlice.reducer