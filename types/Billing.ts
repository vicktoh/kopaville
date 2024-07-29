import { CartItem } from "./Product";
import { Timestamp } from 'firebase/firestore';

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
   date: Timestamp | number | Date;
   paymentStatus: 'pending' | 'paid' | 'pending';
   deliveryDate?: Timestamp | number | Date;
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