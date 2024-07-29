import { Timestamp } from "firebase/firestore";

export type Comment = {
   id?: string;
   date: Timestamp
   userId: string;
   postId: string;
   photoUrl: string;
   comment: string;
   fullname: string;
   username: string;
}