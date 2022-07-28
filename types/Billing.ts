import firebase from 'firebase';
import { CartItem } from "./Product";

export type Billing = {
   address: string;
   city: string;
   state: string;
   postalCode: string;
   closestLandmark?: string;
   phone: string;
}


export type Order = {
   cart: CartItem[]
   userId: string;
   date: firebase.firestore.Timestamp | number | Date;
   paymentStatus: 'pending' | 'paid' | 'pending';
   deliveryDate?: firebase.firestore.Timestamp | number | Date;
   deliveryStatus?: 'shipped' | 'delivered' | 'ending';
   transactionRef : string;
   amount: number;
   billing?: Billing;
   paymentDetails?:{
      transactionRef: string;
      date: string;
      amount: number;
   }
   status?: 'ongoing' | 'closed'
}