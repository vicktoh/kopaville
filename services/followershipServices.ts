import {  firestore } from "./firebase";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";


export type Follower = {
    userId: string;
    photoUrl: string;
    username: string;
    fullname: string;
}

export const followUser = (authId:string, follower: Follower) =>{
    const followingDoc = doc(firestore, `users/${authId}/following/${follower.userId}`);

    return setDoc(followingDoc, follower)
  
}

export const unfollowUser = (authId: string, followingId: string) =>{
    const followingDoc =  doc(firestore, `users/${authId}/following/${followingId}`);
    return deleteDoc(followingDoc);
}

export const fetchFollowers = async (authId: string, type: "following" | "followers" = "followers") => {
    const followersCollection = collection(firestore, `users/${authId}/${type}`);
    const snapshot = await getDocs(followersCollection);
    const userIDs : string[] = [];
    snapshot.forEach((snap)=> {
        userIDs.push(snap.id);
    });
    return userIDs;
}

