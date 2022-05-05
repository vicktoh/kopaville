export type Category= {
   title: string;
   avartar: string;
   description?:string;
   categoryId: string;
}


export type CategorySliceType = {
   categories: Category [];
   map: { [key: string]: string}
}