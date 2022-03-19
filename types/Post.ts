import firebase from "firebase";
export interface Post {
    dateCreated: firebase.firestore.Timestamp;
    mediaType: 'Video'| 'Image' | 'None',
    creatorId: string;
    likes: number;
    comments: number;
    imageUrl?: string [];
    videoUrl?: string;
    caption?: string;
    postId?: string;
    text?: string;
    avartar: {
        photoUrl?: string;
        username: string;
    }

}



