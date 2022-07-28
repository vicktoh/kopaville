import firebase from 'firebase';
import { Business, Job } from './Job';

export type Recipient = {
   fullname: string;
   username: string;
   photoUrl: string;
   userId: string;
}


export type Conversation ={
   conversationId: string;
   memberIds: string[];
   dateCreated: number ;
   dateUpdated: number ;
   type: 'single' | 'group';
   members: Recipient[];
   unreadCount?: number;
}
export enum ChatType  {
   'link' = 'link',
   'message' = 'message',
   'job'="job"
}

export type Chat = {
   id?: string;
   conversationId: string;
   fromId: string;
   toId: string;
   message: string;
   timestamp: firebase.firestore.Timestamp;
   fromUsername: string;
   type?: ChatType
   title?: string;
   link?: string;
   job?:Job & Business;
}