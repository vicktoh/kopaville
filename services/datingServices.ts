import firebase from "firebase";
import { Profile } from "../types/Profile";
import { firebaseApp } from "./firebase";





export const fetchDatingProfiles = async (gender: string, location?: string) =>{
    const db = firebase.firestore(firebaseApp);
    let query =  db.collection('users').where('datingProfile.status', '==', 'single');
    if(location) query = query.where('profile.servingState', '==', location);
    const snapshot =  await  query.get();

    const data: Profile[] = [];
    snapshot.forEach((snap)=>{
        const profile = snap.data() as Profile;
        data.push(profile);
    });
    return data;
}