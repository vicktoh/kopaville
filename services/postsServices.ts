import { firebaseApp, firestore,  storage } from './firebase';
import { FirebasePost, Post } from '../types/Post';
import { Profile } from '../types/Profile';
import { Comment } from '../types/Comment';
import { Conversation } from '../types/Conversation';
import { Report, ReportedUser } from '../types/Report';
import { randomString } from './helpers';
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes,  } from 'firebase/storage';


export const listenOnTimeline = (
    following: Array<string>,
    onsuccessCallback: (data: any) => void,
    onErrorMessage: (e: string) => void,
    blockedList: string []
) => {
    
    const q = query(collection(firestore,'posts'), where('creatorId', 'in', following), orderBy('dateCreated', 'desc'), limit(50))
    return onSnapshot(q, (querysnapshot)=>{
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
    const q = query(collection(firestore, 'posts'),orderBy('dateCreated', 'desc'), orderBy('likes', 'desc'), limit(50) )
    const snapshot = await getDocs(q);
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
    const q = query(collection(firestore, 'posts'),orderBy('dateCreated', 'desc'), orderBy('likes', 'desc'), limit(100) )
    return onSnapshot(q, (snapshot)=>{
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
    const docRef = doc(firestore, `users/${userId}/likes/${postId}`);
    const likeData: any = {
        postId,
        dateLiked: Timestamp.now()
    }
    await setDoc(docRef, likeData);
}

export const removePostFromLikes = async(userId: string, postId: string) =>{
    const docRef = doc(firestore,`users/${userId}/likes/${postId}`);
    await deleteDoc(docRef)
}

export const listenOnlikes = (userId: string, onSuccessCallback: (data: any)=> void) => {
    const likes = collection(firestore, `users/${userId}/likes/`)
    return onSnapshot(likes, (snapshot)=>{
        const likes: string[] = [];
        snapshot.forEach((snap)=> {
            likes.push(snap.id);
        });
        onSuccessCallback(likes);
    })
}

export const listenOnChats = (userId: string, onSuccessCallback: (data: any)=> void) =>{
    const q = query(collection(firestore, `users/${userId}/conversations/`), orderBy('dateUpdated',"desc" ))
    return onSnapshot(q, (snapshot)=> {
        const chats: Conversation[] = [];
        snapshot.forEach((snap)=>{
            let chat = snap.data() as (Omit<Conversation,"dateCreated" | "dateUpdated"> & {dateCreated: Timestamp, dateUpdated: Timestamp});
           
            chats.push({...chat, dateCreated: chat.dateCreated.toMillis(), dateUpdated: chat.dateUpdated.toMillis()})
        });
        onSuccessCallback(chats);
    })
}

export const exploreUsers = async (following: string[] = [], servingState?: string,)=>{
    const q = query(collection(firestore, "users"), where('userId', 'not-in', following), orderBy('userId', 'desc'), orderBy('followerships.followers', 'desc'))
   
    // if(servingState){
    //     query = query.where('profile.servingState', '==', servingState);
    // }
    const snapshot = await getDocs(q);

    const data: Profile[] = [];
    snapshot.forEach((snap)=>{
        const profile = snap.data() as Profile
        data.push(profile);
    })

    return data;
}

export const listenOnFollowers = (userId: string, onSuccessCallback: (data: any) => void) => {
    return onSnapshot(collection(firestore, `users/${userId}/followers`),(snapshot)=>{
        const data:any[] = [];

        snapshot.forEach((snap) => {
            data.push(snap.data());
        });
        onSuccessCallback(data);
    })
};
export const listenonFollowing = (userId: string, onSuccessCallback: (data: any) => void) => {

    return onSnapshot(collection(firestore, `users/${userId}/following`),(snapshot)=>{
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
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
}


export const sendPost = async ({ text, blobs, userId, videoBlob, avartar, mediaType }: SendPostArgs) => {
    const newPostRef = doc(collection(firestore, 'posts'));
    const imageUrls: any [] = [];
    if(blobs&& blobs.length){
        for(const blob of blobs){
            const storageKey = randomString(5);
            const storageRef = ref(storage, `posts/${newPostRef.id}-${storageKey}`);
            const snapshot = await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            imageUrls.push({url: downloadUrl, storageKey });
        }
    }
    let videoUrl: null | string = null
    if(videoBlob){
        const storageRef = ref(storage, `posts/${newPostRef.id}`);
        const snapshot = await uploadBytes(storageRef,  videoBlob);
         videoUrl = await getDownloadURL(snapshot.ref);

    }
    
    const postData: FirebasePost = {
        dateCreated: Timestamp.now(),
        ...(text ? { text } : {}),
        ...(imageUrls.length ? { imageUrl: imageUrls}: {}),
        ...(videoUrl ? {videoUrl} : {}),
        creatorId: userId,
        comments: 0,
        likes: 0,
        mediaType,
        avartar
    };
    await setDoc(newPostRef, postData)
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
            const storageRef = ref(storage, `posts/${post.postId}-${storageKey}`);
            const snapshot = await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(snapshot.ref);
                imageUrls.push({ url: downloadUrl , storageKey });
        }
    }
    
    let videoUrl:string | null = null;
    if (videoBlob) {
        const storageRef = ref(storage, `posts/${post.postId}`);
        const snapshot = await uploadBytes(storageRef, videoBlob);
        videoUrl = await getDownloadURL(snapshot.ref);
    }
    const docRef = doc(firestore, `posts/${post.postId}`);
    for (const key of removedImages){
     const deleteRef  = ref(storage, `posts/${post.postId}-${key}`)
     deleteObject(deleteRef)
    }
    return updateDoc(docRef, {
        ...(text ? { text } : {}),
        ...(imageUrls.length ? { imageUrl: imageUrls } : {}),
        ...(videoUrl ? { videoUrl } : {}),
        mediaType,
        avartar,
    });
};

export const listenOnComments = ( postId: string, onSuccessCallback:  (data: Comment[]) => void) =>{
    const q = query(collection(firestore, 'comments'), where('postId', '==', postId))
    return onSnapshot(q, (snapshot) => {
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
    const commentRef = doc(collection(firestore, 'comments'))
    return setDoc(commentRef, comment);
}


export const removePost = async (postId: string) => {
        // const db = firebase.firestore(firebaseApp);
        await deleteDoc(doc(firestore, `posts/${postId}`)); 
}


export const reportPost = async (report: Report) =>{
    try {
        const reportRef = doc(collection(firestore, 'reports'))
        await setDoc(reportRef, report);
    } catch (error) {
        console.log(error);
    }
}

export const reportUser = async (report: ReportedUser) => {
    const userReportRef = doc(collection(firestore, 'userReports'));
    return setDoc(userReportRef, report)
}

