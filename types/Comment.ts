import firebase from "firebase"

export type Comment = {
   id?: string;
   date: firebase.firestore.Timestamp
   userId: string;
   postId: string;
   photoUrl: string;
   comment: string;
   fullname: string;
   username: string;
}