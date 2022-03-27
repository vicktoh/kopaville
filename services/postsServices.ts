import { firebaseApp } from './firebase';
import firebase from 'firebase';
import { Post } from '../types/Post';
import { Profile } from '../types/Profile';


export const listenOnTimeline = (
    following: Array<string>,
    onsuccessCallback: (data: any) => void,
    onErrorMessage: (e: string) => void
) => {
    const db = firebase.firestore(firebaseApp);
    return db.collection('posts').where('creatorId', 'in', following).orderBy('dateCreated', 'desc').limit(50).onSnapshot((querysnapshot)=>{
        const data: any[] = [];
        querysnapshot.forEach((snap) => {
            const dat = snap.data() as Post;
            dat.postId = snap.id;
            data.push({...dat, dateCreated: dat.dateCreated.toMillis()});
        });
        onsuccessCallback(data)
    }, (error)=> {onErrorMessage(error.message)})
};


export const explorePosts = async ()=>{
    const db = firebase.firestore(firebaseApp)
    const snapshot =  await  db.collection('posts').orderBy('dateCreated', 'desc').orderBy('likes', 'desc').limit(50).get();
    const data: (Post & {id?: string})[] = [];
    snapshot.forEach((snap)=>{
        const post: Post & {id?: string} = snap.data() as Post;
        post.id = snap.id;
        data.push(post);
    });

    return data;
}

export const addPostTolikes = async (userId: string, postId: string) => {
    const db = firebase.firestore(firebaseApp);
    const docRef = db.collection(`users/${userId}/likes`).doc(postId);
    const likeData: any = {
        postId,
        dateLiked: firebase.firestore.Timestamp.now()
    }
    await docRef.set(likeData);
}

export const removePostFromLikes = async(userId: string, postId: string) =>{
    const db = firebase.firestore(firebaseApp);
    const docRef = db.doc(`users/${userId}/likes/${postId}`);
    await docRef.delete();
}

export const listenOnlikes = (userId: string, onSuccessCallback: (data: any)=> void) => {
    const db = firebase.firestore(firebaseApp);
    return db.collection(`users/${userId}/likes/`).onSnapshot((snapshot)=>{
        const likes: string[] = [];
        snapshot.forEach((snap)=> {
            likes.push(snap.id);
        });
        onSuccessCallback(likes);
    })
}

export const exploreUsers = async (following: string[] = [], servingState?: string,)=>{
    const db = firebase.firestore(firebaseApp);
    let  query = db.collection('users').where('userId', 'not-in', following);
    query = query.orderBy('userId', 'desc');
    query = query.orderBy('followerships.followers', 'desc');
    if(servingState){
        query = query.where('profile.servingState', '==', servingState);
    }
    const snapshot = await query.get();

    const data: Profile[] = [];
    snapshot.forEach((snap)=>{
        const profile = snap.data() as Profile
        data.push(profile);
    })

    return data;
}

export const listenOnFollowers = (userId: string, onSuccessCallback: (data: any) => void) => {
    const db = firebase.firestore(firebaseApp);
    return db.collection(`users/${userId}/followers`).onSnapshot((snapshot)=>{
        const data:any[] = [];

        snapshot.forEach((snap) => {
            data.push(snap.data());
        });
        onSuccessCallback(data);
    })
};
export const listenonFollowing = (userId: string, onSuccessCallback: (data: any) => void) => {

    const db = firebase.firestore(firebaseApp);
    return db.collection(`users/${userId}/following`).onSnapshot((snapshot)=>{
        const data:any[] = [];
        snapshot.forEach((snap) => {
            data.push(snap.data());
        });
        onSuccessCallback(data);
    })
};

type SendPostArgs = {
    text?: string;
    blobs?: Blob[];
    videoBlob?: Blob;
    userId: string;
    mediaType: 'Video' | 'Image' | 'None'
    avartar: {
        username: string;
        photoUrl?: string;
    }
 };

export const sendPost = async ({ text, blobs, userId, videoBlob, avartar, mediaType }: SendPostArgs) => {
    const db = firebase.firestore(firebaseApp);
    const newPostRef = db.collection('posts').doc();
    
    const storage = firebase.storage().ref(`posts/${newPostRef.id}`);
    const imageUrls = [];
    
    if(blobs&& blobs.length){
        for(const blob of blobs){
            const snapshot = await storage.put(blob);
            const downloadUrl = await snapshot.ref.getDownloadURL();
            imageUrls.push(downloadUrl);
        }
    }
    let videoUrl = null
    if(videoBlob){
        const snapshot = await storage.put(videoBlob);
         videoUrl = await snapshot.ref.getDownloadURL();

    }
    
    const postData: Post = {
        dateCreated: firebase.firestore.Timestamp.now(),
        ...(text ? { text } : {}),
        ...(imageUrls.length ? { imageUrl: imageUrls}: {}),
        ...(videoUrl ? {videoUrl} : {}),
        creatorId: userId,
        comments: 0,
        likes: 0,
        mediaType,
        avartar
    };
    await newPostRef.set(postData)
};
