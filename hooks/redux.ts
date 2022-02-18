import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, StoreType, AppDispatch } from '../reducers/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector