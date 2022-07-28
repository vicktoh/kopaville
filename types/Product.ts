import firebase from 'firebase';
export enum ProductGrade {
   "New" = "New",
   "Fairly Used" = "Fairly Used",
   "Used" = "Used"
}

export type  Product = {
   productId?: string;
   vendorId:string;
   userId: string;
   name: string;
   variant?: Record<string, []>
   rating?: number;
   grade?: ProductGrade;
   numberOfRating?: number;
   purchases?: number;
   price: number;
   quantity: number;
   orderCount?: number;
   description: string;
   photoUrl?: string;
   category: string;
   vendorName: string;
   images: string[];
   dateAdded: firebase.firestore.Timestamp;
}

export type ProductFormValue = {
   name: string;
   price: number;
   quantity: number;
   description: string;
   category: string;
   photoUrl?: string;
}

export type ProductFilter = {
   category?: string;
   minPrice?: number;
   maxPrice?: number;
};

export type CartItem = {
   productName: string;
   productId?: string;
   productImage: string;
   quantity: number;
   price: number;
}