import firebase from 'firebase';
import { Post } from "./Post"
import { Profile } from './Profile';

export type Report = {
   post: Post,
   reporter: {
      displayName: string;
      photoUrl: string;
      userName: string;
      userId: string
   }
   date: firebase.firestore.Timestamp | number
   reason: string;
   description?: string;
}

export type ReportedUser = {
   user: Profile,
   reporter: Report["reporter"],
   date: firebase.firestore.Timestamp | number;
   description?: string;
   reason: string;
}


export type HttpResponse = {
   status: 'success' | 'failed';
   message?: string;
}