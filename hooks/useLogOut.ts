import { useDispatch } from "react-redux";
import { setAuth } from "../reducers/authSlice";
import { logOut } from "../services/authServices";
import useCachedResources from "./useCachedResources"

export const useLogout = ()=> {
   const dispatch = useDispatch();

   async function logoutFlow(){
      await logOut();
      dispatch(setAuth(null));
   }
   return logoutFlow;
}