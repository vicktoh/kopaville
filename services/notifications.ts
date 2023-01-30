import firebase from "firebase";
require("firebase/functions");
import {firebaseApp} from "./firebase";


export const sendNotification = (message: string, userId: string) => {
   const functions = firebase.functions(firebaseApp);
   const notify = functions.httpsCallable('notify');
   try {
      notify({message, userId}).then((value)=> {
         // console.log(value, "notification status")
      })
   } catch (error) {
      console.log({error})
   }
   

}