import firebase from 'firebase';

export type  Product = {
   productId?: string;
   vendorId:string;
   userId: string;
   name: string;
   rating?: number;
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