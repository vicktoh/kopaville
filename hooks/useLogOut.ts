import { useDispatch } from "react-redux";
import { setAuth } from "../reducers/authSlice";
import { logOut } from "../services/authServices";
import useCachedResources from "./useCachedResources"
import { persistor } from "../reducers/store";
export const useLogout = ()=> {
   const dispatch = useDispatch();

   async function logoutFlow(){
      await logOut();
      setTimeout(async () => {persistor.purge(), dispatch(setAuth(null))}, 200);
      
   }
   return logoutFlow;
}