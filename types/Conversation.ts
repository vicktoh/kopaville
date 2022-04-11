import firebase from 'firebase';

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

export type Chat = {
   id?: string;
   conversationId: string;
   fromId: string;
   toId: string;
   message: string;
   timestamp: firebase.firestore.Timestamp;
   fromUsername: string;
}