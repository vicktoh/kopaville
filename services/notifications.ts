import { httpsCallable } from "firebase/functions";
import {functions} from "./firebase";


export const sendNotification = (message: string, userId: string) => {
   const notify = httpsCallable(functions, 'notify');
   try {
      notify({message, userId}).then((value)=> {
         // console.log(value, "notification status")
      })
   } catch (error) {
      console.log({error})
   }
   

}