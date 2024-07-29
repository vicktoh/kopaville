import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { Billing, Order } from '../types/Billing';
import { Category, CategorySliceType } from '../types/Category';
import { Product, ProductFilter } from '../types/Product';
import { firebaseApp, firestore } from './firebase';

export const listenOnCategories = (callback: (data:CategorySliceType) => void)=> {
   const q = query(collection(firestore, 'categories'), limit(5))
   return onSnapshot(q, (querysnapshot)=> {
      const data: any = [];
      const categoriesMap: {[key: string]: string } = {};
      querysnapshot.forEach((snap)=> {
         const category = snap.data() as Category;
         category.categoryId = snap.id;
         data.push(category);
         categoriesMap[snap.id]= category.title
      });
      callback({categories: data, map: categoriesMap});
   })

}

export const listenOnConfirmedOrder = (transactionRef: string, callback: (data: any)=> void) =>{
   return onSnapshot(doc(firestore, `confirmedOrders/${transactionRef}`),(snapshot)=> {
      if(snapshot.exists()){
         callback(snapshot.data());
      }
   })
}

export const fetchProducts =  async (filter: ProductFilter ) => {
   let q = query(collection(firestore, 'products'), orderBy('dateAdded'));
   if(filter?.category){
      q = query(q, where('category', '==', filter.category))
   }
   if(filter?.maxPrice){
      q = query(q, where('price', "<=", filter.maxPrice));
   }
   if(filter?.minPrice){
      q = query(q, where('price', '>=', filter.minPrice));
   }

   const snapshot = await getDocs(q)
   const outputData: Product[] = [];
   snapshot.forEach((snap)=> {
      const product = snap.data() as Product;
      product.productId = snap.id;
      outputData.push(product);
   });
   return outputData;
}


export const updateBillingInfo = async (userId: string, billing: Billing)=>{
      await  setDoc(doc(firestore, `billing/${userId}`), billing); 
}

export const makeOrder = async(transactionRef: string, order: Order) => {
   return setDoc(doc(firestore, `orders/${transactionRef}`), order);
}

export const fetchOrders = async (userId: string) => {
   const q = query(collection(firestore, `users/${userId}/orders`), orderBy('date', 'desc'))
   const querySnapshot =  await getDocs(q);
   const data: Order[] = [];
   querySnapshot.forEach((snap)=> {
      const order = snap.data() as Order;
      order.date = (order.date as Timestamp).toDate();
      data.push(order);
   });

   return data;

}