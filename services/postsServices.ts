import { fireStore } from './firebase';
import { query, onSnapshot, where, collection, orderBy, Firestore, limit } from '@firebase/firestore';

export const listenOnTimeline = (
    following: Array<string>,
    onsuccessCallback: (data: any) => void,
    onErrorMessage: (e: string) => void
) => {
    const q = query(collection(fireStore, 'posts'), where('creatorId', 'in', following), orderBy('dateCreated', 'desc'), limit(50));
    return onSnapshot(
        q,
        (snapshot) => {
            const data: any[] = [];
            snapshot.forEach((snap) => {
                data.push(snap.data());
            });
            onsuccessCallback(data);
        },
        (error) => {
            onErrorMessage(error.message);
        }
    );
};


export const listenOnFollowers = (userId: string, onSuccessCallback : (data: any)=>void) =>{

    const followersCollection = collection(fireStore, `users/${userId}/followers`);
    return onSnapshot(followersCollection, (snapshot)=>{
        const data: any[] =[];
        snapshot.forEach((snap)=>{
            data.push(snap.data());
        });
        onSuccessCallback(data);
    });
}
export const listenonFollowing = (userId: string, onSuccessCallback : (data: any)=>void) =>{

    const followersCollection = collection(fireStore, `users/${userId}/following`);
    return onSnapshot(followersCollection, (snapshot)=>{
        const data: any[] =[];
        snapshot.forEach((snap)=>{
            data.push(snap.data());
        });
        onSuccessCallback(data);
    });
}
