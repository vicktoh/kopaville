import firebase from "firebase";
import { firebaseApp } from "./firebase";


export type Follower = {
    userId: string;
    photoUrl: string;
    username: string;
    fullname: string;
}

export const followUser = (authId:string, follower: Follower) =>{
    const db = firebase.firestore(firebaseApp);
    const followingCollection = db.collection(`users/${authId}/following`);
    return followingCollection.doc(follower.userId).set(follower);
}

export const unfollowUser = (authId: string, followingId: string) =>{
    const db = firebase.firestore(firebaseApp);
    const followingDoc =  db.doc(`users/${authId}/following/${followingId}`);
    return followingDoc.delete();
}

