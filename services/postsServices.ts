import { firebaseApp } from './firebase';
import firebase from 'firebase';
import { FirebasePost, Post } from '../types/Post';
import { Profile } from '../types/Profile';
import { Comment } from '../types/Comment';
import { Conversation } from '../types/Conversation';
import { Report, ReportedUser } from '../types/Report';
import { randomString } from './helpers';


export const listenOnTimeline = (
    following: Array<string>,
    onsuccessCallback: (data: any) => void,
    onErrorMessage: (e: string) => void,
    blockedList: string []
) => {
    
    const db = firebase.firestore(firebaseApp);
    return db.collection('posts').where('creatorId', 'in', following).orderBy('dateCreated', 'desc').limit(50).onSnapshot((querysnapshot)=>{
        const data: any[] = [];
        querysnapshot.forEach((snap) => {
            const dat = snap.data() as FirebasePost;
            if(!blockedList.includes(dat.creatorId)){
                dat.postId = snap.id;
                data.push({...dat, dateCreated: dat.dateCreated.toMillis()});
            }
            
        });
        onsuccessCallback(data)
    }, (error)=> {console.log("errorr");onErrorMessage(error.message)})
};


export const explorePosts = async (blockedList: string[])=>{
    const db = firebase.firestore(firebaseApp)
    const snapshot =  await  db.collection('posts').orderBy('dateCreated', 'desc').orderBy('likes', 'desc').limit(50).get();
    const data: (Post & {id?: string})[] = [];
    snapshot.forEach((snap)=>{
        const post: FirebasePost & {id?: string} = snap.data() as FirebasePost;
        if(!blockedList.includes(post.creatorId)){
            post.postId = snap.id;
            
{            data.push({...post , dateCreated: post.dateCreated.toMillis()})
}        };
    });

    return data;
}

export const listenOnExplorePost = async (blockedList: string[], callback: (post: Post[], err: string) => void) => {
    const db = firebase.firestore(firebaseApp);
    return db.collection('posts').orderBy('dateCreated', 'desc').orderBy('likes', 'desc').limit(100).onSnapshot((snapshot)=>{
        const data: Post[] = [];
        snapshot.forEach((snap) => {
            const dat = snap.data() as FirebasePost ;
            if(!blockedList.includes(dat.creatorId)){
                dat.postId = snap.id;
                data.push({...dat, dateCreated: dat.dateCreated.toMillis()});
            }

    })
    callback(data, "")
    }, (error)=> {console.log("errorr");callback([], error.message)})
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

export const listenOnChats = (userId: string, onSuccessCallback: (data: any)=> void) =>{
    const db = firebase.firestore(firebaseApp);
    return db.collection(`users/${userId}/conversations/`).orderBy('dateUpdated',"desc" ).onSnapshot((snapshot)=> {
        const chats: Conversation[] = [];
        snapshot.forEach((snap)=>{
            let chat = snap.data() as (Omit<Conversation,"dateCreated" | "dateUpdated"> & {dateCreated: firebase.firestore.Timestamp, dateUpdated: firebase.firestore.Timestamp});
           
            chats.push({...chat, dateCreated: chat.dateCreated.toMillis(), dateUpdated: chat.dateUpdated.toMillis()})
        });
        onSuccessCallback(chats);
    })
}

export const exploreUsers = async (following: string[] = [], servingState?: string,)=>{
    const db = firebase.firestore(firebaseApp);
    let  query = db.collection('users').where('userId', 'not-in', following);
    query = query.orderBy('userId', 'desc');
    query = query.orderBy('followerships.followers', 'desc');
    // if(servingState){
    //     query = query.where('profile.servingState', '==', servingState);
    // }
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

export const removeUploadedPic = async (postId: string, index: number, type: Post['mediaType']) => {
    const path = type === 'Image' ? `posts/${postId}-${index}` : `posts/${postId}`
    const storage = firebase.storage().ref(path);
    await storage.delete();
}


export const sendPost = async ({ text, blobs, userId, videoBlob, avartar, mediaType }: SendPostArgs) => {
    const db = firebase.firestore(firebaseApp);
    const newPostRef = db.collection('posts').doc();
    const imageUrls = [];
    if(blobs&& blobs.length){
        for(const blob of blobs){
            const storageKey = randomString(5);
            const storage = firebase.storage().ref(`posts/${newPostRef.id}-${storageKey}`);
            const snapshot = await storage.put(blob);
            const downloadUrl = await snapshot.ref.getDownloadURL();
            imageUrls.push({url: downloadUrl, storageKey });
        }
    }
    let videoUrl = null
    if(videoBlob){
        const storage = firebase.storage().ref(`posts/${newPostRef.id}`);
        const snapshot = await storage.put(videoBlob);
         videoUrl = await snapshot.ref.getDownloadURL();

    }
    
    const postData: FirebasePost = {
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

export const editPost = async (
    { blobs, videoBlob, text, mediaType, avartar }: SendPostArgs,
    post: Partial<Pick<Post, 'imageUrl' | 'videoUrl' | 'text' | 'postId'>>,
    removedImages: string [],
) => {
    if (!post.postId) return;
    const imageUrls = [...(post.imageUrl || [])];
    if (blobs && blobs.length) {
    
        for (const blob of blobs) {
            const storageKey = randomString(5);
            const storage = firebase.storage().ref(`posts/${post.postId}-${storageKey}`);
            const snapshot = await storage.put(blob);
            const downloadUrl = await snapshot.ref.getDownloadURL();
                imageUrls.push({ url: downloadUrl , storageKey });
        }
    }
    
    let videoUrl = null;
    if (videoBlob) {
        const storage = firebase.storage().ref(`posts/${post.postId}`);
        const snapshot = await storage.put(videoBlob);
        videoUrl = await snapshot.ref.getDownloadURL();
    }
    const db = firebase.firestore(firebaseApp);
    const docRef = db.doc(`posts/${post.postId}`);
    for (const key of removedImages){
      firebase.storage().ref(`posts/${post.postId}-${key}`).delete()
    }
    return docRef.update({
        ...(text ? { text } : {}),
        ...(imageUrls.length ? { imageUrl: imageUrls } : {}),
        ...(videoUrl ? { videoUrl } : {}),
        mediaType,
        avartar,
    });
};

export const listenOnComments = ( postId: string, onSuccessCallback:  (data: Comment[]) => void) =>{
    const db = firebase.firestore(firebaseApp);
    return db.collection('comments').where('postId', '==', postId).onSnapshot((snapshot) => {
        const data : Comment[] = [];
        snapshot.forEach((snap)=>{
            const comment = snap.data() as Comment;
            comment.id = snap.id;
            data.push(comment)
        })

        onSuccessCallback(data);
    })

}

export const commentOnPost = (comment: Comment) => {
    const db = firebase.firestore(firebaseApp);
    return db.collection('comments').doc().set(comment);
}


export const removePost = async (postId: string) => {
        const db = firebase.firestore(firebaseApp);
        await db.doc(`posts/${postId}`).delete(); 
}


export const reportPost = async (report: Report) =>{
    try {
        const db = firebase.firestore(firebaseApp);
        await db.collection('reports').doc().set(report);
    } catch (error) {
        console.log(error);
    }
}

export const reportUser = async (report: ReportedUser) => {
    const db = firebase.firestore(firebaseApp);
    return db.collection("userReports").doc().set(report);
}

