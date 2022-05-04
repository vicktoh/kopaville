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
        },
        increaseQuantity: (state: any, action: PayloadAction<number>)=>{
           if(!state) return;
           state[action.payload].quantity++;
           return state;
        },
        decreaseQuantity: (state: any, action: PayloadAction<number>) => {
           if(! state) return;
           state[action.payload].quantity--;
           return state;
        },
        removeItem : (state: any, action: PayloadAction<number>) => {
           if(!state) return;
           state.splice(action.payload, 1);
           return state;
        }
    }
});


export const { setCart, addToCart, increaseQuantity, decreaseQuantity, removeItem } = cartSlice.actions;

export default cartSlice.reducer