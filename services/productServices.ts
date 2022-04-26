import firebase from 'firebase';
import { Category, CategorySliceType } from '../types/Category';
import { Product, ProductFilter } from '../types/Product';
import { firebaseApp } from './firebase';

export const listenOnCategories = (callback: (data:CategorySliceType) => void)=> {
   const db = firebase.firestore(firebaseApp);

   return db.collection('categories').limit(5).onSnapshot((querysnapshot)=> {
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

export const fetchProducts =  async (filter: ProductFilter ) => {
   const db = firebase.firestore(firebaseApp);
   let query = db.collection('products').orderBy('dateAdded');
   if(filter?.category){
      query = query.where('category', '==', filter.category);
   }
   if(filter?.maxPrice){
      query = query.where('price', "<=", filter.maxPrice);
   }
   if(filter?.minPrice){
      query = query.where('price', '>=', filter.minPrice);
   }

   const snapshot = await query.get();
   const outputData: Product[] = [];
   snapshot.forEach((snap)=> {
      const product = snap.data() as Product;
      product.productId = snap.id;
      outputData.push(product);
   });
   return outputData;
}