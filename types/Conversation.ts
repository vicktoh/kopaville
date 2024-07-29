import { Business, Job } from './Job';
import { Post } from './Post';
import { Timestamp } from 'firebase/firestore';

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
   'post' = 'post',
   'job'="job"
}

export type Chat = {
   id?: string;
   conversationId: string;
   fromId: string;
   toId: string;
   message: string;
   timestamp: Timestamp;
   fromUsername: string;
   type?: ChatType
   title?: string;
   link?: string;
   job?:Job & Business;
   post?: Post;
}